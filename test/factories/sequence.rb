FactoryBot.define do
  sequence :string, aliases: [:first_name, :last_name, :password, :name, :description] do |n|
    "string#{n}"
  end
  sequence :email do |n|
    "person#{n}@example.com"
  end
  sequence :avatar do |n|
    "avatar#{n}#{SecureRandom.urlsafe_base64(8)}.com"
  end
  sequence :reset_token do
    SecureRandom.urlsafe_base64(8)
  end
  sequence :reset_sent_at do
    Time.current
  end
  sequence :expired_at do |n|
    Date.current + n
  end
end
