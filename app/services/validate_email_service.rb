class ValidateEmailService
  include ActiveModel::Model

  attr_accessor :email

  validates :email, presence: true, format: { with: /\A\S+@.+\.\S+\z/ }
  validate :user_email_valid?, if: :email_valid?

  def initialize(attributes = {})
    super
  end

  def user
    @user ||= User.find_by(email: email)
  end

  private

  def email_valid?
    errors[:email].blank?
  end

  def user_email_valid?
    if user.blank?
      errors.add(:email, 'invalid')
      false
    else
      true
    end
  end
end
