class TaskSerializer < ApplicationSerializer
  attributes :id, :name, :description, :state, :expired_at, :transitions
  belongs_to :author, serializer: AuthorSerializer
  belongs_to :assignee

  def transitions
    object.state_transitions.map do |transition|
      {
        event: transition.event,
        from: transition.from,
        to: transition.to,
      }
    end
  end
end
