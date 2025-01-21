class User < ApplicationRecord
  has_secure_password
  EMAIL_REGEXP = /\A[a-zA-Z0-9.!\#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\z/.freeze

  has_many :my_tasks, class_name: 'Task', foreign_key: :author_id
  has_many :assigned_tasks, class_name: 'Task', foreign_key: :assignee_id

  validates :first_name, :last_name, presence: true, length: { minimum: 2 }
  validates :email, presence: true, uniqueness: true, format: { with: EMAIL_REGEXP }

  validates :password, presence: true, length: { minimum: 2 }, on: :create

  def self.ransackable_attributes(_auth_object = nil)
    ['email', 'first_name', 'id', 'last_name', 'type']
  end

  def self.ransackable_associations(_auth_object = nil)
    ['assigned_tasks', 'my_tasks']
  end
end
