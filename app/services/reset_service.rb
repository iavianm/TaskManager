class ResetService
  include ActiveModel::Model

  attr_accessor :token, :email

  def user_by_token
    @user_by_token ||= User.find_by(reset_token: token)
  end

  def user_by_email
    @user_by_email ||= User.find_by(email: email)
  end

  def user_token_valid?
    if user_by_token.blank? || password_reset_expired?(@user_by_token.reset_sent_at)
      errors.add(:token, 'is invalid or expired')
      false
    else
      true
    end
  end

  def user_email_valid?
    unless email.match(/\A\S+@.+\.\S+\z/)
      errors.add(:email, 'format is invalid')
      return false
    end

    if user_by_email.blank?
      errors.add(:email, 'is invalid')
      false
    else
      true
    end
  end

  private

  def password_reset_expired?(reset_sent_at)
    reset_sent_at < 24.hours.ago
  end
end
