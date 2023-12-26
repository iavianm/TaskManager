document.addEventListener('DOMContentLoaded', () => {
  const emailField = document.getElementById('email_field');
  const errorEmailMessage = document.getElementById('error_email_message');
  const errorPassMessage = document.getElementById('error_pass_message');
  const submitPassButton = document.getElementById('submit_pass_button');
  const submitEmailButton = document.getElementById('submit_email_button');

  const passwordField = document.getElementById('password_field');
  const passwordConfirmationField = document.getElementById('password_confirmation_field');

  const EMAIL_REGEXP = /^\S+@\S+\.\S+$/;

  const validateEmail = (email) => EMAIL_REGEXP.test(String(email));

  if (submitPassButton) {
    submitPassButton.classList.add('disabled', submitPassButton.disabled);
  }

  if (submitEmailButton) {
    submitEmailButton.classList.add('disabled', submitEmailButton.disabled);
  }

  const updateSubmitEmailButtonState = () => {
    const emailValue = emailField.value;
    const isValidEmail = validateEmail(emailValue);
    const isEmailEmpty = emailValue.length === 0;
    submitEmailButton.disabled = !isValidEmail || isEmailEmpty;
    submitEmailButton.classList.toggle('disabled', !isValidEmail || isEmailEmpty);
    if (errorEmailMessage) {
      errorEmailMessage.textContent =
        (isEmailEmpty && 'Email is empty') || (!isValidEmail && 'Invalid email format') || '';
    }
  };

  if (emailField && submitEmailButton) {
    emailField.addEventListener('input', updateSubmitEmailButtonState);
  }

  const updateSubmitPassButtonState = () => {
    const isPasswordShort = passwordField.value.length < 2;
    const isPasswordMismatch = passwordField.value !== passwordConfirmationField.value;

    submitPassButton.disabled = isPasswordShort || isPasswordMismatch;
    submitPassButton.classList.toggle('disabled', submitPassButton.disabled);

    errorPassMessage.textContent =
      (isPasswordShort && 'Password is too short') || (isPasswordMismatch && 'Passwords do not match') || '';
  };

  if (passwordField && passwordConfirmationField && submitPassButton) {
    passwordField.addEventListener('input', updateSubmitPassButtonState);
    passwordConfirmationField.addEventListener('input', updateSubmitPassButtonState);
  }
});
