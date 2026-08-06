export function validateEmail(email) {
  const value = typeof email === 'string' ? email.trim() : '';
  return value.length > 0 && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateName(name) {
  const value = typeof name === 'string' ? name.trim() : '';
  return value.length >= 2 && value.length <= 60;
}

export function validatePhone(phone) {
  return /^\d{10}$/.test(typeof phone === 'string' ? phone.replace(/\D/g, '') : '');
}

export function passwordChecks(password) {
  const value = typeof password === 'string' ? password : '';
  return {
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    number: /\d/.test(value),
    special: /[^A-Za-z0-9]/.test(value)
  };
}

export function isStrongPassword(password) {
  return Object.values(passwordChecks(password)).every(Boolean);
}

export function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

export function normalizePhone(phone) {
  const value = phone === undefined || phone === null ? '' : String(phone);
  return value.replace(/\D/g, '');
}

export function validateProductInput(input, { partial = false } = {}) {
  const errors = [];
  if (!partial || input.name !== undefined) {
    if (typeof input.name !== 'string' || input.name.trim().length < 1 || input.name.trim().length > 200) {
      errors.push('Name is required (max 200 characters).');
    }
  }
  if (!partial || input.price !== undefined) {
    const price = Number(input.price);
    if (!Number.isFinite(price) || price <= 0) {
      errors.push('Price must be a positive number.');
    }
  }
  if (!partial || input.mrp !== undefined) {
    if (input.mrp === null) {
      errors.push('MRP must be a number.');
    } else {
      const mrp = Number(input.mrp);
      const price = Number(input.price);
      if (!Number.isFinite(mrp) || mrp < 0) {
        errors.push('MRP must be a non-negative number.');
      } else if (Number.isFinite(price) && mrp > 0 && price > mrp) {
        errors.push('MRP cannot be lower than the selling price.');
      }
    }
  }
  if (!partial || input.category !== undefined) {
    if (typeof input.category !== 'string' || input.category.trim().length < 1 || input.category.trim().length > 100) {
      errors.push('Category is required (max 100 characters).');
    }
  }
  if (!partial || input.image !== undefined) {
    if (typeof input.image !== 'string' || input.image.trim().length < 1 || input.image.trim().length > 1000) {
      errors.push('Image URL is required.');
    }
  }
  if (input.description !== undefined && typeof input.description === 'string' && input.description.length > 2000) {
    errors.push('Description must be 2000 characters or fewer.');
  }
  if (input.popularity !== undefined) {
    const popularity = Number(input.popularity);
    if (!Number.isFinite(popularity) || popularity < 0 || popularity > 100) {
      errors.push('Popularity must be between 0 and 100.');
    }
  }
  if (input.stock !== undefined) {
    const stock = Number(input.stock);
    if (!Number.isInteger(stock) || stock < 0 || stock > 9999) {
      errors.push('Stock must be a whole number between 0 and 9999.');
    }
  }
  return errors;
}

export function validateOrderInput(input) {
  const errors = [];
  if (!Array.isArray(input.items) || input.items.length === 0) {
    errors.push('Order must contain at least one item.');
  }
  for (const [index, item] of (Array.isArray(input.items) ? input.items : []).entries()) {
    if (!item || typeof item.product !== 'string' || item.product.length === 0) {
      errors.push(`Item ${index + 1} is missing a product id.`);
    }
    const qty = Number(item.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
      errors.push(`Item ${index + 1} has an invalid quantity.`);
    }
  }
  const shippingInfo = input.shippingInfo;
  if (!shippingInfo || typeof shippingInfo !== 'object') {
    errors.push('Shipping information is required.');
  } else {
    for (const field of ['firstName', 'lastName', 'email', 'address', 'city', 'zip']) {
      if (typeof shippingInfo[field] !== 'string' || shippingInfo[field].trim().length < 1) {
        errors.push(`${field} is required.`);
      }
    }
    if (shippingInfo.email && !validateEmail(shippingInfo.email)) {
      errors.push('Shipping email is invalid.');
    }
    if (shippingInfo.phone && !validatePhone(shippingInfo.phone)) {
      errors.push('Shipping phone is invalid.');
    }
  }
  return errors;
}
