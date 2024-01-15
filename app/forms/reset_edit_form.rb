class ResetEditForm
  include ActiveModel::Model

  attr_accessor :token

  validate :token_valid?

  def user
    TokenService.find_user_by_token(token)
  end

  def token_valid?
    errors.add(:token, :invalid) unless TokenService.token_valid?(token)
  end
end
