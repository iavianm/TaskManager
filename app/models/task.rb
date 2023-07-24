class Task < ApplicationRecord
  belongs_to :author, class_name: 'User'
  belongs_to :assignee, class_name: 'User', optional: true

  validates :name, presence: true
  validates :description, presence: true
  validates :author, presence: true
  validates :description, length: { maximum: 500 }

  state_machine initial: :new_task do
    state :new_task
    state :in_development
    state :in_qa
    state :in_code_review
    state :ready_for_release
    state :released
    state :archived

    event :start_development do
      transitions from: [:new_task, :in_qa, :in_code_review], to: :in_development
    end

    event :move_to_qa do
      transitions from: :in_development, to: :in_qa
    end

    event :request_code_review do
      transitions from: :in_qa, to: :in_code_review
    end

    event :mark_ready_for_release do
      transitions from: :in_code_review, to: :ready_for_release
    end

    event :release do
      transitions from: :ready_for_release, to: :released
    end

    event :archive do
      transitions from: [:new_task, :released], to: :archived
    end
  end
end
