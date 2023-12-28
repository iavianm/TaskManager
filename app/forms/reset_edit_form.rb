class ResetEditForm
  include ActiveModel::Model

  attr_accessor :token

  validate :check_token

  def initialize(attributes = {})
    super
    @reset_service = ResetService.new(token: token)
  end

  def user
    @reset_service.user_by_token
  end

  def check_token
    unless @reset_service.user_token_valid?
      @reset_service.errors.each do |error|
        errors.add(error.attribute, error.message)
      end
    end
  end
end
