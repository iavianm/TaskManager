class Web::PasswordResetsController < Web::ApplicationController
  def new; end

  def create
    create_form = ResetCreateForm.new(user_params)

    unless create_form.valid?
      error_message = create_form.errors.full_messages.join(', ')
      flash.now[:danger] = error_message
      @error_message = error_message
      @previous_input = create_form.email
      return render('new')
    end

    GenerateTokenService.new(create_form.email.downcase).update_params_and_send_email
    flash[:success] = 'Check your email for password reset instructions'
    redirect_to(root_url)
  end

  def edit
    edit_form = ResetEditForm.new(token: params[:token])
    unless edit_form.valid?
      return redirect_to(new_password_reset_url, alert: edit_form.errors.full_messages.join(', '))
    end

    @user = edit_form.user
    flash[:success] = 'Enter new password'
  end

  def update
    update_form = ResetUpdateForm.new(user_params)
    unless update_form.valid?
      flash.now[:danger] = update_form.errors.full_messages.join(', ')
      return render('edit')
    end

    user = update_form.user
    update_params = user_params.slice(:password, :password_confirmation)

    user.update(update_params)
    user.update_columns(reset_token: nil, reset_sent_at: nil)
    flash[:success] = 'Password has been reset.'
    redirect_to(root_url)
  end

  private

  def user_params
    params.require(:user).permit(:token, :email, :password, :password_confirmation)
  end
end
