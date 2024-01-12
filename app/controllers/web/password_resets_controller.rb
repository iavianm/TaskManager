class Web::PasswordResetsController < Web::ApplicationController
  def new; end

  def create
    create_form = ResetCreateForm.new(user_params)

    if create_form.valid?
      TokenService.update_params_and_send_email(create_form.email.downcase)
    end

    flash[:success] = 'Check your email for password reset instructions'
    redirect_to(root_url)
  end

  def edit
    edit_form = ResetEditForm.new(token: params[:token])
    unless edit_form.valid?
      return redirect_to(new_password_reset_url, alert: edit_form.errors.full_messages.join(', '))
    end

    @user = edit_form.user
  end

  def update
    update_form = ResetUpdateForm.new(user_params)

    if update_form.valid?
      update_params = user_params.slice(:password, :password_confirmation)

      TokenService.update_params_and_clear_token(update_form.user.email, update_params)
      flash[:success] = 'Password has been reset.'
    end

    redirect_to(root_url)
  end

  private

  def user_params
    params.require(:user).permit(:token, :email, :password, :password_confirmation)
  end
end
