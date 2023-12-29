class ResetEditForm
  include ActiveModel::Model

  attr_accessor :token

  validate :check_token

  def initialize(attributes = {})
    super
    @valid_token_service = ValidateTokenService.new(attributes.slice(:token))
  end

  def user
    @valid_token_service.user
  end

  def check_token
    unless @valid_token_service.valid?
      errors.merge!(@valid_token_service.errors)
    end
  end
end
