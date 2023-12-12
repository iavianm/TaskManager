class Web::PasswordResetsController < Web::ApplicationController
  def new; end

  def create
    if params[:email].blank?
      flash[:danger] = 'Email cannot be blank'
      @error_message = 'Email cannot be blank'
      @previous_input = params[:email]
      render('new')
    else
      @user = User.find_by(email: params[:email].downcase)
      if @user
        GenerateTokenService.new(@user).send_token_reset_email
        @previous_input = ''
        redirect_to(root_url)
        flash.clear
      else
        flash[:danger] = 'Email address not found'
        @error_message = 'Email address not found'
        @previous_input = params[:email]
        render('new')
      end
    end
  end

  def edit
    check_valid_user_and_token
  end

  def update
    check_valid_user_and_token
    if params[:user][:password].empty?
      @user.errors.add(:password, "can't be empty")
      @error_message = "Password can't be empty"
      render('edit')
    elsif @user.update(user_params)
      @user.update_columns(reset_token: nil, reset_sent_at: nil)
      redirect_to(root_url)
      flash[:success] = 'Password has been reset.'
    else
      render('edit')
    end
  end

  private

  def user_params
    params.require(:user).permit(:password, :password_confirmation)
  end

  def get_user
    @user = User.find_by(reset_token: params[:token])
  end

  def check_expiration
    if password_reset_expired?(@user.reset_sent_at)
      flash[:danger] = 'Password reset has expired.'
      redirect_to(new_password_reset_url)
    else
      flash[:success] = 'Enter new password'
    end
  end

  def password_reset_expired?(reset_sent_at)
    reset_sent_at < 24.hours.ago
  end

  def check_valid_user_and_token
    get_user
    if @user.nil?
      redirect_to(root_url, alert: 'User not found or token is invalid')
      return
    end
    check_expiration
  end
end
