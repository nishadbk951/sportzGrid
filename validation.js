
export function isValidEmail(email) {
  let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}


export function isValidPhone(phone) {
  let phonePattern = /^[0-9]{10}$/;
  return phonePattern.test(phone);
}


export function isValidPassword(password) {
  return password.length >= 6;
}


export function isPasswordMatch(password, confirmPassword) {
  return password === confirmPassword;
}