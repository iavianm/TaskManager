class SendTaskDeleteNotificationJob < NotificationJob

  def perform(task_id, user_id)
    user = User.find_by(id: user_id)
    return if user.blank?

    UserMailer.with({ user: user, task_id: task_id }).task_deleted.deliver_now
  end
end
