class TokenService
  class << self
    def token_valid?(token)
      user = find_user_by_token(token)
      user.present? && !password_reset_expired?(user.reset_sent_at)
    end

    def email_valid?(email)
      user = find_user_by_email(email)
      user.present?
    end

    def update_params_and_send_email(email)
      user = find_user_by_email(email)
      return unless user

      token = generate_token

      User.transaction do
        set_password_reset_attributes!(user, token: token, time: Time.current)
        send_token_reset_email(user, token)
      end
    end

    def update_params_and_clear_token(email, update_params)
      user = find_user_by_email(email)
      return unless user

      User.transaction do
        set_password_reset_attributes!(user, update_params: update_params)
      end
    end

    def find_user_by_token(token)
      User.find_by(reset_token: token)
    end

    def find_user_by_email(email)
      User.find_by(email: email)
    end

    private

    def generate_token
      SecureRandom.urlsafe_base64
    end

    def set_password_reset_attributes!(user, update_params: {}, token: nil, time: nil)
      user.update!(update_params.merge(reset_token: token, reset_sent_at: time))
    end

    def send_token_reset_email(user, token)
      UserMailer.with(user: user, token: token).reset_password_email.deliver_later
    end

    def password_reset_expired?(reset_sent_at)
      reset_sent_at < 24.hours.ago
    end
  end
end
