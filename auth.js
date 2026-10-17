
import { getUserByEmail, registerUser } from "./api.js";
import { saveLoggedInUser } from "./storage.js";
import { isValidEmail, isValidPhone, isValidPassword, isPasswordMatch } from "./validation.js";


let signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let nameValue = document.getElementById("name").value.trim();
    let emailValue = document.getElementById("email").value.trim();
    let phoneValue = document.getElementById("phone").value.trim();
    let passwordValue = document.getElementById("password").value.trim();
    let confirmPasswordValue = document.getElementById("confirmPassword").value.trim();

    let nameError = document.getElementById("nameError");
    let emailError = document.getElementById("emailError");
    let phoneError = document.getElementById("phoneError");
    let passwordError = document.getElementById("passwordError");
    let confirmPasswordError = document.getElementById("confirmPasswordError");

    nameError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";

    let isValid = true;

    
    if (nameValue === "") {
      nameError.textContent = "Name is required";
      isValid = false;
    }

    
    if (emailValue === "") {
      emailError.textContent = "Email is required";
      isValid = false;
    } else if (!isValidEmail(emailValue)) {
      emailError.textContent = "Please enter a valid email address";
      isValid = false;
    }

    
    if (phoneValue === "") {
      phoneError.textContent = "Phone number is required";
      isValid = false;
    } else if (!isValidPhone(phoneValue)) {
      phoneError.textContent = "Please enter a valid 10-digit phone number";
      isValid = false;
    }

    
    if (passwordValue === "") {
      passwordError.textContent = "Password is required";
      isValid = false;
    } else if (!isValidPassword(passwordValue)) {
      passwordError.textContent = "Password must be at least 6 characters";
      isValid = false;
    }

    
    if (confirmPasswordValue === "") {
      confirmPasswordError.textContent = "Please confirm your password";
      isValid = false;
    } else if (!isPasswordMatch(passwordValue, confirmPasswordValue)) {
      confirmPasswordError.textContent = "Passwords do not match";
      isValid = false;
    }

    
    if (isValid) {
      try {
        let existingUser = await getUserByEmail(emailValue);

        if (existingUser) {
          emailError.textContent = "Email is already registered";
          return;
        }

        let newUser = {
          name: nameValue,
          email: emailValue,
          phone: phoneValue,
          password: passwordValue
        };

        await registerUser(newUser);

        alert("Account Created Successfully!");
        window.location.href = "login.html";

      } catch (error) {
        console.error("Signup error:", error);
        emailError.textContent = "Registration failed. Server error!";
      }
    }
  });
}



let loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let emailValue = document.getElementById("loginEmail").value.trim();
    let passwordValue = document.getElementById("loginPassword").value.trim();
    let loginError = document.getElementById("loginError");

    if (loginError) loginError.textContent = "";

    if (emailValue === "" || passwordValue === "") {
      if (loginError) loginError.textContent = "Please enter both email and password";
      return;
    }

    
    if (emailValue === "admin@gmail.com" && passwordValue === "admin123") {
      let adminData = {
        name: "Admin",
        email: "admin@gmail.com",
        role: "admin"
      };

      saveLoggedInUser(adminData);
      alert("Admin Login Successful!");
      window.location.href = "admin.html";
      return;
    }

    try {
      let user = await getUserByEmail(emailValue);

      if (!user || String(user.password) !== String(passwordValue)) {
        if (loginError) loginError.textContent = "Invalid email or password";
        return;
      }

      saveLoggedInUser(user);
      
      alert("Login Successful!");
      window.location.href = "index.html";

    } catch (error) {
      console.error("Login catch error:", error);
      if (loginError) loginError.textContent = "Something went wrong. Please try again.";
    }
  });
}