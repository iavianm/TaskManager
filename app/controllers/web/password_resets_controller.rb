class Web::PasswordResetsController < Web::ApplicationController
  def new; end

  def create
    @reset_form = PasswordResetForm.new(email: params[:email].downcase)
    if @reset_form.user_email_valid?
      GenerateTokenService.new(email: params[:email].downcase).send_token_reset_email
      flash[:success] = 'Check your email for password reset instructions'
      redirect_to(root_url)
    else
      flash.now[:danger] = @reset_form.errors.full_messages.join(', ')
      @error_message = @reset_form.errors.full_messages.join(', ')
      @previous_input = params[:email]
      render('new')
    end
  end

  def edit
    @reset_form = PasswordResetForm.new(token: params[:token])

    if @reset_form.user_token_valid?
      @user = @reset_form.user_by_token
      flash[:success] = 'Enter new password'
    else
      redirect_to(new_password_reset_url, alert: @reset_form.errors.full_messages.join(', '))
    end
  end

  def update
    @reset_form = PasswordResetForm.new(token: params[:token], password: user_params)
    if @reset_form.valid?
      user = @reset_form.user_by_token
      user.update(user_params)
      user.update_columns(reset_token: nil, reset_sent_at: nil)
      flash[:success] = 'Password has been reset.'
      redirect_to(root_url)
    else
      flash.now[:danger] = @reset_form.errors.full_messages.join(', ')
      render('edit')
    end
  end

  private

  def user_params
    params.require(:user).permit(:password, :password_confirmation)
  end
end
