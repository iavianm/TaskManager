FactoryBot.define do
  factory :task do
    name { generate(:first_name) }
    description
    author factory: :manager
    assignee factory: :manager
    state { 'new_task' }
  end
end
