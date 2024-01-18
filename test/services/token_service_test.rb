require 'test_helper'

class TokenServiceTest < ActiveSupport::TestCase
  include ActiveSupport::Testing::TimeHelpers

  setup do
    @user = create(:user, reset_token: 'token', reset_sent_at: Time.current)
    @expired_user = create(:user, reset_token: 'expired_token', reset_sent_at: 3.days.ago)
  end

  test 'token_valid? returns true for a valid token' do
    assert TokenService.token_valid?(@user.reset_token)
  end

  test 'token_valid? returns false for an expired token' do
    refute TokenService.token_valid?(@expired_user.reset_token)
  end

  test 'email_valid? returns true for an existing user' do
    assert TokenService.email_valid?(@user.email)
  end

  test 'email_valid? returns false for a non-existing user' do
    refute TokenService.email_valid?('nonexistent@example.com')
  end

  test 'send_token_reset_email sends an email' do
    assert_emails 1 do
      TokenService.update_params_and_send_email(@user.email)
    end

    sent_email = ActionMailer::Base.deliveries.last
    assert_equal ['noreply@taskmanager.com'], sent_email.from
    assert_equal [@user.email], sent_email.to
    assert_equal 'Password reset instructions', sent_email.subject
    assert sent_email.body.to_s.include?("Hello, #{@user.first_name}!")

    @user.reload
    refute_equal 'token', @user.reset_token
    assert @user.reset_sent_at > 2.hours.ago
  end

  test 'update_params_and_clear_token updates user' do
    update_params = { reset_token: nil, reset_sent_at: nil }
    TokenService.update_params_and_clear_token(@user.email, update_params)

    @user.reload
    assert_nil @user.reset_token
    assert_nil @user.reset_sent_at
  end
end
