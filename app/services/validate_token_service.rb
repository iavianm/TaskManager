class ValidateTokenService
  include ActiveModel::Model

  attr_accessor :token, :password, :password_confirmation

  validate :user_token_valid?

  def initialize(attributes = {})
    super
  end

  def user
    @user ||= User.find_by(reset_token: token)
  end

  private

  def user_token_valid?
    if user.blank? || password_reset_expired?(user.reset_sent_at)
      errors.add(:token, 'is invalid or expired')
      false
    else
      true
    end
  end

  def password_reset_expired?(reset_sent_at)
    reset_sent_at < 24.hours.ago
  end
end
