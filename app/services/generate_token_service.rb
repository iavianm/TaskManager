class GenerateTokenService
  include ActiveModel::Model

  attr_accessor :email

  def generate_token
    SecureRandom.urlsafe_base64
  end

  def set_password_reset_attributes(user, token)
    user.update_columns(
      reset_token: token,
      reset_sent_at: Time.current,
    )
  end

  def send_token_reset_email
    user = User.find_by(email: email)
    return unless user

    token = generate_token
    set_password_reset_attributes(user, token)
    UserMailer.with(user: user, token: token).reset_password_email.deliver_later
  end
end
