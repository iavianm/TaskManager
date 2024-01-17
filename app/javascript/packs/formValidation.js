document.addEventListener('DOMContentLoaded', () => {
  const emailField = document.getElementById('email_field');
  const errorEmailMessage = document.getElementById('error_email_message');
  const errorPassMessage = document.getElementById('error_pass_message');
  const submitPassButton = document.getElementById('submit_pass_button');
  const submitEmailButton = document.getElementById('submit_email_button');

  const passwordField = document.getElementById('password_field');
  const passwordConfirmationField = document.getElementById('password_confirmation_field');

  const EMAIL_REGEXP_PART1 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@/;
  const EMAIL_REGEXP_PART2 = /[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?/;
  const EMAIL_REGEXP_PART3 = /\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?/;
  const EMAIL_REGEXP_PART4 = /(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const EMAIL_REGEXP = new RegExp(
    EMAIL_REGEXP_PART1.source + EMAIL_REGEXP_PART2.source + EMAIL_REGEXP_PART3.source + EMAIL_REGEXP_PART4.source,
  );

  const validateEmail = (email) => EMAIL_REGEXP.test(String(email));

  const updateSubmitEmailButtonState = () => {
    if (!validateEmail(emailField.value)) {
      submitEmailButton.disabled = true;
      submitEmailButton.classList.add('disabled');
    } else {
      submitEmailButton.classList.remove('disabled');
      submitEmailButton.disabled = false;
    }
  };

  if (emailField && submitEmailButton) {
    emailField.addEventListener('input', () => {
      if (errorEmailMessage) {
        errorEmailMessage.textContent = '';
      }
      updateSubmitEmailButtonState();
    });
    updateSubmitEmailButtonState();
  }

  const updateSubmitPassButtonState = () => {
    const passwordsMatch = passwordField.value === passwordConfirmationField.value;
    const passwordsNotEmpty = passwordField.value !== '' && passwordConfirmationField.value !== '';
    if (!passwordsMatch || !passwordsNotEmpty) {
      submitPassButton.disabled = true;
      submitPassButton.classList.add('disabled');
    } else {
      submitPassButton.classList.remove('disabled');
      submitPassButton.disabled = false;
    }
  };

  const checkPasswords = () => {
    if (passwordField.value !== passwordConfirmationField.value) {
      errorPassMessage.textContent = 'Passwords do not match';
    } else {
      errorPassMessage.textContent = '';
    }
    updateSubmitPassButtonState();
  };

  if (passwordField && passwordConfirmationField && submitPassButton) {
    passwordField.addEventListener('input', checkPasswords);
    passwordConfirmationField.addEventListener('input', checkPasswords);
    updateSubmitPassButtonState();
  }
});
