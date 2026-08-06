export function validateEmail(email) {
  const value = email.trim();
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateName(name) {
  const value = name.trim();
  return value.length >= 2 && value.length <= 60;
}

export function passwordChecks(password) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
}

export function validatePhone(phone) {
  return /^\d{10}$/.test(phone.replace(/\D/g, ''));
}

export function isStrongPassword(password) {
  const checks = passwordChecks(password);
  return Object.values(checks).every(Boolean);
}
