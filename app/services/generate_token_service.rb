class GenerateTokenService
  def initialize(user)
    @user = user
  end

  def generate_token
    SecureRandom.urlsafe_base64
  end

  def set_password_reset_attributes(token)
    @user.update_columns(
      reset_token: token,
      reset_sent_at: Time.current,
    )
  end

  def send_token_reset_email
    token = generate_token
    set_password_reset_attributes(token)
    UserMailer.with(user: @user, token: token).reset_password_email.deliver_later
  end
end
