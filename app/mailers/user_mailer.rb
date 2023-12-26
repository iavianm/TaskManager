class UserMailer < ApplicationMailer
  default from: 'noreply@taskmanager.com'

  def task_created
    user = params[:user]
    @task = params[:task]

    mail(to: user.email, subject: 'Task Created')
  end

  def task_updated
    user = params[:user]
    @task = params[:task]

    mail(to: user.email, subject: 'Task Updated')
  end

  def task_deleted
    user = params[:user]
    @task = params[:task]

    mail(to: user.email, subject: 'Task Deleted')
  end

  def reset_password_email
    @user = params[:user]
    @token = params[:token]
    @url = edit_password_reset_url(token: @token)
    mail(to: @user.email, subject: 'Password reset instructions')
  end
end
