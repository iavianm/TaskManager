require 'test_helper'

class UserMailerTest < ActionMailer::TestCase
  setup do
    @user = create(:user)
    @task = create(:task, author: @user)
    @params = { user: @user, task: @task }
    @email_params = { user: @user, token: @user.reset_token }
  end

  test 'task_notification for task creation' do
    email = UserMailer.with(@params).task_created

    assert_emails 1 do
      email.deliver_now
    end

    assert_equal ['noreply@taskmanager.com'], email.from
    assert_equal [@user.email], email.to
    assert_equal 'Task Created', email.subject
    assert email.body.to_s.include?("Task #{@task.id} was created")
  end

  test 'task_notification for task update' do
    email = UserMailer.with(@params).task_updated

    assert_emails 1 do
      email.deliver_now
    end

    assert_equal ['noreply@taskmanager.com'], email.from
    assert_equal [@user.email], email.to
    assert_equal 'Task Updated', email.subject
    assert email.body.to_s.include?("Task #{@task.id} was updated")
  end

  test 'task_notification for task deletion' do
    email = UserMailer.with(@params).task_deleted

    assert_emails 1 do
      email.deliver_now
    end

    assert_equal ['noreply@taskmanager.com'], email.from
    assert_equal [@user.email], email.to
    assert_equal 'Task Deleted', email.subject
    assert email.body.to_s.include?("Task #{@task.id} was deleted")
  end

  test 'reset_password_email' do
    email = UserMailer.with(@email_params).reset_password_email

    assert_emails 1 do
      email.deliver_now
    end

    assert_equal ['noreply@taskmanager.com'], email.from
    assert_equal [@user.email], email.to
    assert_equal 'Password reset instructions', email.subject
    assert email.body.to_s.include?("Hello, #{@user.first_name}!")
  end
end
