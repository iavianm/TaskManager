require 'test_helper'

class PasswordResetsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
  end

  test 'should get new' do
    get new_password_reset_url
    assert_response :success
  end

  test 'should create reset token for existing user' do
    post password_resets_url, params: { email: @user.email }
    assert_redirected_to root_url
  end

  test 'should not create reset token for non-existing user' do
    post password_resets_url, params: { email: 'nonexistent@example.com' }
    assert_template 'new'
    assert_not_empty flash[:danger]
  end

  test 'should get edit if valid token' do
    token = @user.reset_token
    get edit_password_reset_url(token)
    assert_response :success
  end

  test 'should redirect edit if invalid token' do
    get edit_password_reset_url('invalid')
    assert_response :redirect
    assert_redirected_to root_url
  end

  test 'should update user password with valid token' do
    token = @user.reset_token
    original_password_digest = @user.password_digest
    patch password_reset_url(token), params: { user: { password: 'newpassword', password_confirmation: 'newpassword' } }

    @user.reload
    assert_not_equal original_password_digest, @user.password_digest, 'Password digest should have changed'
    assert_redirected_to root_url, 'Should redirect to root URL after password reset'
  end

  test 'should not update user password with invalid token' do
    original_password_digest = @user.password_digest
    patch password_reset_url('invalid'), params: { user: { password: 'newpassword', password_confirmation: 'newpassword' } }

    @user.reload
    assert_equal original_password_digest, @user.password_digest, 'Password digest should not have changed'
    assert_response :redirect
    assert_redirected_to root_url
  end

  test 'should redirect edit if password reset expired' do
    expired_user = create(:user, reset_sent_at: 25.hours.ago)

    token = expired_user.reset_token
    get edit_password_reset_url(token)

    assert_response :redirect
    assert_redirected_to new_password_reset_url
  end
end
