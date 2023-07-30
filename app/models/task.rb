class Task < ApplicationRecord
  belongs_to :author, class_name: 'User'
  belongs_to :assignee, class_name: 'User', optional: true

  validates :name, presence: true
  validates :description, presence: true
  validates :author, presence: true
  validates :description, length: { maximum: 500 }

  def self.ransackable_attributes(_auth_object = nil)
    ['assignee_id', 'author_id', 'created_at', 'description', 'expired_at', 'id', 'name', 'state', 'updated_at']
  end

  state_machine :state, initial: :new_task do
    event :start_development do
      transition [:new_task, :in_qa, :in_code_review] => :in_development
    end

    event :move_to_qa do
      transition in_development: :in_qa
    end

    event :request_code_review do
      transition in_qa: :in_code_review
    end

    event :mark_ready_for_release do
      transition in_code_review: :ready_for_release
    end

    event :release do
      transition ready_for_release: :released
    end

    event :archive do
      transition [:new_task, :released] => :archived
    end
  end
end
