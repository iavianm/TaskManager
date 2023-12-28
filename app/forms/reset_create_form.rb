class ResetCreateForm
  include ActiveModel::Model

  attr_accessor :email

  validate :check_email

  def initialize(attributes = {})
    super
    @reset_service = ResetService.new(email: email.downcase)
  end

  def user
    @reset_service.user_by_email
  end

  def check_email
    unless @reset_service.user_email_valid?
      @reset_service.errors.each do |error|
        errors.add(error.attribute, error.message)
      end
    end
  end
end
