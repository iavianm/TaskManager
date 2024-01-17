class SendTaskCreateNotificationJob < NotificationJob

  def perform(task_id)
    task = Task.find_by(id: task_id)
    return if task.blank?

    UserMailer.with({ user: task.author, task_id: task.id }).task_created.deliver_now
  end
end
