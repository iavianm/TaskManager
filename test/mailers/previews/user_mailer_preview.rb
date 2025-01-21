class UserMailerPreview < ActionMailer::Preview
  def task_created
    user = User.first
    task = Task.first
    UserMailer.with(user: user, task: task).task_created
  end

  def task_updated
    user = User.first
    task = Task.first
    UserMailer.with(user: user, task: task).task_updated
  end

  def task_deleted
    user = User.first
    task = Task.first
    UserMailer.with(user: user, task: task).task_deleted
  end

  def forgot_password
    user = User.first
    UserMailer.with(user: user, token: user.reset_token).reset_password_email
  end
end
