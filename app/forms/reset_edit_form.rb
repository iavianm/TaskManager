class ResetEditForm
  include ActiveModel::Model

  attr_accessor :token

  validate :token_valid?

  def user
    User.find_by(reset_token: token)
  end

  def token_valid?
    errors.add(:token, :invalid) unless TokenService.token_valid?(token)
  end
end
