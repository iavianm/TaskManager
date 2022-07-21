FactoryBot.define do
  factory :task do
    name { generate(:first_name) }
    description
    author factory: :manager
    assignee factory: :manager
    state { 'new_task' }
    expired_at { '2022-07-15' }
  end
end
