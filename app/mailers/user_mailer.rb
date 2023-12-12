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

    mail(to: user.email, subject: subject)
  end

  def reset_password_email
    @user = params[:user]
    @token = params[:token]
    @url = edit_password_reset_url(token: @token)
    mail(to: @user.email, subject: 'Password reset instructions')
  end
end
