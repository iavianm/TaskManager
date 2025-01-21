class ResetUpdateForm < ResetEditForm
  attr_accessor :password

  validates :password, presence: true, confirmation: true, length: { minimum: 2 }
end
