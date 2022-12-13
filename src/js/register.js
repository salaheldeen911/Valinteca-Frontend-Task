const INPUTS = {
  username: document.getElementById("username"),
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  password_confirmation: document.getElementById("password_confirmation"),
};

const INPUTS_ERRORS = {
  username_error: document.getElementById("username_error"),
  email_error: document.getElementById("email_error"),
  password_error: document.getElementById("password_error"),
  password_confirmation_error: document.getElementById(
    "password_confirmation_error"
  ),
};

const USERNAME_ERRORS = {
  required: "Username cannot be empty!",
  first: "First character must be a letter!",
  general: "Username should consist of letters and numbers only!",
  length: "Username must consist of 5 to 15 characters!",
  last: "Last character must be a letter!",
};

const EMAIL_ERRORS = {
  required: "Email cannot be empty!",
  invalid: "Invalid email!",
};

const PASSWORD_ERRORS = {
  required: "Password cannot be empty!",
  length: "Password must be at least 8 characters!",
};

const PASSWORD_CONFIRM_ERRORS = {
  required: "Password Confirmation cannot be empty!",
  match: "Password Confirmation dosn't match the password field!",
};

let isValidUsername = (value) => {
  if (value.length == 0) {
    showError(INPUTS_ERRORS.username_error, USERNAME_ERRORS.required);
    return false;
  }
  if (!isNotNumber(value.charAt(0))) {
    showError(INPUTS_ERRORS.username_error, USERNAME_ERRORS.first);
    return false;
  }
  if (!onlyLettersAndNumbers(value)) {
    showError(INPUTS_ERRORS.username_error, USERNAME_ERRORS.general);
    return false;
  }
  if (!validUsernameLength(value)) {
    showError(INPUTS_ERRORS.username_error, USERNAME_ERRORS.length);
    return false;
  }
  if (!isNotNumber(value.charAt(value.length - 1))) {
    showError(INPUTS_ERRORS.username_error, USERNAME_ERRORS.last);
    return false;
  }

  return true;
};

let isValidEmail = (value) => {
  if (value.length == 0) {
    showError(INPUTS_ERRORS.email_error, EMAIL_ERRORS.required);
    return false;
  }
  if (!isEmail(value)) {
    showError(INPUTS_ERRORS.email_error, EMAIL_ERRORS.invalid);
    return false;
  }

  return true;
};

let isValidPassword = (value) => {
  if (value.length == 0) {
    showError(INPUTS_ERRORS.password_error, PASSWORD_ERRORS.required);
    return false;
  }
  if (!validPasswordLength(value)) {
    showError(INPUTS_ERRORS.password_error, PASSWORD_ERRORS.length);
    return false;
  }

  return true;
};

let isValidPasswordConfirmation = (value) => {
  if (value.length == 0) {
    showError(
      INPUTS_ERRORS.password_confirmation_error,
      PASSWORD_CONFIRM_ERRORS.required
    );
    return false;
  }
  if (!validPasswordConfirmation(INPUTS.password.value, value)) {
    showError(
      INPUTS_ERRORS.password_confirmation_error,
      PASSWORD_CONFIRM_ERRORS.match
    );
    return false;
  }

  return true;
};

let onlyLettersAndNumbers = (username) => /^[a-z0-9]+$/i.test(username);

let validUsernameLength = (username) =>
  username.length < 5 || username.length > 15 ? false : true;

let isNotNumber = (username) => /[a-z]/i.test(username);

let isEmail = (emailAdress) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAdress);

let validPasswordLength = (password) => (password.length >= 8 ? true : false);

let validPasswordConfirmation = (password, confirm) =>
  password === confirm ? true : false;

let showError = (element, message = "Not Valid!") => {
  element.innerHTML = message;
  element.classList.add("active");
};

let isValidForm = () => {
  emptyErrors();
  let hasErrors = false;
  for (const [type, input] of Object.entries(INPUTS)) {
    switch (type) {
      case "username":
        !isValidUsername(input.value) ? (hasErrors = true) : null;
        break;
      case "email":
        !isValidEmail(input.value) ? (hasErrors = true) : null;
        break;
      case "password":
        !isValidPassword(input.value) ? (hasErrors = true) : null;
        break;
      case "password_confirmation":
        !isValidPasswordConfirmation(input.value) ? (hasErrors = true) : null;
        break;
      default:
        console.error("Unknown error type: " + type);
        break;
    }
  }

  return hasErrors ? false : true;
};

let emptyErrors = () => {
  for (const [key, element] of Object.entries(INPUTS_ERRORS)) {
    element.innerHTML = "";
    element.classList.remove("active");
  }
};

let showServerErrors = (serverErrors) => {
  emptyErrors();
  for (const [type, errors] of Object.entries(serverErrors)) {
    switch (type) {
      case "username":
        showError(INPUTS_ERRORS.username_error, errors[0]);
        break;
      case "email":
        showError(INPUTS_ERRORS.email_error, errors[0]);
        break;
      case "password":
        showError(INPUTS_ERRORS.password_error, errors[0]);
        break;
      case "password_confirmation":
        showError(INPUTS_ERRORS.password_confirmation_error, errors[0]);
        break;
      default:
        console.error("Unknown error type: " + type);
    }
  }
};

let collectFormData = () => {
  let formData = {};
  FORM.querySelectorAll("input").forEach((element) => {
    formData[element.name] = element.value;
  });

  return formData;
};

let sendRequest = (e) => {
  e.preventDefault();
  if (!isValidForm()) {
    return false;
  }
  emptyErrors();

  const formData = collectFormData();
  fetch("https://goldblv.com/api/hiring/tasks/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.errors) {
        showServerErrors(data.errors);
      } else {
        saveUser(data);
        window.location.href = "home.html";
      }
    });
};

let saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

const FORM = document.getElementById("register");
FORM.addEventListener("submit", sendRequest);
