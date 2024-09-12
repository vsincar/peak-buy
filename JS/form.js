function validateForm(formId) {
  const form = document.getElementById(formId);
  const inputs = form.querySelectorAll("input");
  const submitButton = form.querySelector('button[type="submit"]');

  let isValid = true;
  inputs.forEach((input) => {
    if (!input.checkValidity()) {
      isValid = false;
    }
  });

  submitButton.disabled = !isValid;
}

document
  .getElementById("signin-form")
  .addEventListener("input", () => validateForm("signin-form"));
document
  .getElementById("register-form")
  .addEventListener("input", () => validateForm("register-form"));

function showForm(formType) {
  const formOverlay = document.getElementById("form-overlay");
  const formContainer = document.getElementById("form-container");
  const signinForm = document.getElementById("signin-form");
  const registerForm = document.getElementById("register-form");

  formOverlay.classList.remove("hidden");
  formContainer.classList.remove("hidden");

  if (formType === "signin") {
    signinForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
  } else if (formType === "register") {
    registerForm.classList.remove("hidden");
    signinForm.classList.add("hidden");
  }

  document.body.style.overflow = "hidden";
}

function hideForm() {
  const formOverlay = document.getElementById("form-overlay");
  const formContainer = document.getElementById("form-container");
  const signinForm = document.getElementById("signin-form");
  const registerForm = document.getElementById("register-form");

  formOverlay.classList.add("hidden");
  formContainer.classList.add("hidden");
  signinForm.classList.add("hidden");
  registerForm.classList.add("hidden");
  document.body.style.overflow = "auto";
}

document
  .getElementById("form-overlay")
  .addEventListener("click", function (event) {
    if (event.target === this) {
      hideForm();
    }
  });

document
  .getElementById("signin-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
  });

document
  .getElementById("register-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
  });

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

function validatePassword() {
  if (password.value != confirmPassword.value) {
    confirmPassword.setCustomValidity("Passwords Don't Match");
  } else {
    confirmPassword.setCustomValidity("");
  }
}

password.onchange = validatePassword;
confirmPassword.onkeyup = validatePassword;

window.addEventListener("load", function () {
  const formState = localStorage.getItem("formState");
  if (formState) {
    showForm(formState);
    localStorage.removeItem("formState");
  }
});

window.addEventListener("beforeunload", function () {
  const formOverlay = document.getElementById("form-overlay");
  if (!formOverlay.classList.contains("hidden")) {
    const signinForm = document.getElementById("signin-form");
    const formState = signinForm.classList.contains("hidden")
      ? "register"
      : "signin";
    localStorage.setItem("formState", formState);
  }
});
