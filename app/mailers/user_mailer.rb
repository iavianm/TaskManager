class UserMailer < ApplicationMailer
  default from: 'noreply@taskmanager.com'
  def task_notification(action)
    user = params[:user]
    @task = params[:task]
    @action = action

    case @action
    when :created
      subject = 'Task Created'
    when :updated
      subject = 'Task Updated'
    when :deleted
      subject = 'Task Deleted'
    end

    mail(from: 'noreply@taskmanager.com', to: user.email, subject: subject)
  end
end
