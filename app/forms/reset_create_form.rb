class ResetCreateForm
  include ActiveModel::Model

  attr_accessor :email

  validates :email, presence: true, format: { with: /\A\S+@.+\.\S+\z/ }
  validate :email_valid?

  def email_valid?
    errors.add(:email, :invalid) unless TokenService.email_valid?(email)
  end
end
