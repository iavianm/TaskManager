class UserMailerPreview < ActionMailer::Preview
  def task_created
    user = User.first
    task = Task.first
    UserMailer.with(user: user, task: task).task_notification(:created)
  end

  def task_updated
    user = User.first
    task = Task.first
    UserMailer.with(user: user, task: task).task_notification(:updated)
  end

  def task_deleted
    user = User.first
    task = Task.first
    UserMailer.with(user: user, task: task).task_notification(:deleted)
  end
end
