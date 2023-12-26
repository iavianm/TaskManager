class Web::PasswordResetsController < Web::ApplicationController
  before_action :set_user_and_check_token, only: [:edit, :update]

  def new; end

  def create
    if params[:email].blank?
      flash.now[:danger] = 'Email cannot be blank'
      @error_message = 'Email cannot be blank'
      @previous_input = params[:email]
      return render('new')
    end

    email_service = GenerateTokenService.new(params[:email].downcase)
    @user = email_service.find_user_by_email

    unless @user
      flash.now[:danger] = 'User not found'
      @error_message = 'User not found'
      @previous_input = params[:email]
      return render('new')
    end

    email_service.send_token_reset_email
    redirect_to(root_url)
    flash.clear
  end

  def edit
    if @user.nil? || @token_expired
      return
    end

    flash[:success] = 'Enter new password'
  end

  def update
    if @user.nil? || @token_expired
      return
    end

    if params[:user][:password].empty?
      @error_message = "Password can't be empty"
      return render('edit')
    end

    if @user.update(user_params)
      @user.update_columns(reset_token: nil, reset_sent_at: nil)
      flash[:success] = 'Password has been reset.'
      redirect_to(root_url)
    else
      render('edit')
    end
  end

  private

  def user_params
    params.require(:user).permit(:password, :password_confirmation)
  end

  def set_user_and_check_token
    email_service = GenerateTokenService.new(params[:token])
    @user = email_service.find_user_by_token

    if @user.nil?
      redirect_to(root_url, alert: 'User not found or token is invalid')
      @token_expired = true
      return
    end

    if email_service.password_reset_expired?(@user.reset_sent_at)
      flash[:danger] = 'Password reset has expired.'
      redirect_to(new_password_reset_url)
      @token_expired = true
    end
  end
end
