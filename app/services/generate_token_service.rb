class GenerateTokenService
  def initialize(params)
    @params = params
    @user = nil
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

  def find_user_by_token
    @user = User.find_by(reset_token: @params)
  end

  def find_user_by_email
    @user = User.find_by(email: @params)
  end

  def password_reset_expired?(reset_sent_at)
    reset_sent_at < 24.hours.ago
  end
end
