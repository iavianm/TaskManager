class ResetCreateForm
  include ActiveModel::Model

  attr_accessor :email

  validate :check_email

  def initialize(attributes = {})
    super
    @valid_email_service = ValidateEmailService.new(attributes)
  end

  def user
    @valid_email_service.user
  end

  def check_email
    unless @valid_email_service.valid?
      errors.merge!(@valid_email_service.errors)
    end
  end
end
