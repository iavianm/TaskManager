require 'test_helper'

class UserMailerTest < ActionMailer::TestCase
  setup do
    @user = create(:user)
    @task = create(:task, author: @user)
    @params = { user: @user, task: @task }
  end

  test 'task_notification for task creation' do
    email = UserMailer.with(@params).task_notification(:created)

    assert_emails 1 do
      email.deliver_now
    end

    assert_equal ['noreply@taskmanager.com'], email.from
    assert_equal [@user.email], email.to
    assert_equal 'Task Created', email.subject
    assert email.body.to_s.include?("Task #{@task.id} was created")
  end

  test 'task_notification for task update' do
    email = UserMailer.with(@params).task_notification(:updated)

    assert_emails 1 do
      email.deliver_now
    end

    assert_equal ['noreply@taskmanager.com'], email.from
    assert_equal [@user.email], email.to
    assert_equal 'Task Updated', email.subject
    assert email.body.to_s.include?("Task #{@task.id} was updated")
  end

  test 'task_notification for task deletion' do
    email = UserMailer.with(@params).task_notification(:deleted)

    assert_emails 1 do
      email.deliver_now
    end

    assert_equal ['noreply@taskmanager.com'], email.from
    assert_equal [@user.email], email.to
    assert_equal 'Task Deleted', email.subject
    assert email.body.to_s.include?("Task #{@task.id} was deleted")
  end
end
