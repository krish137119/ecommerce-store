const STORAGE_KEY = 'shopeasy.savedAccounts';

export function getSavedAccounts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveAccount(user) {
  if (!user || !user.email) return;
  const entry = { email: user.email, role: user.role, name: user.name };
  const next = [entry, ...getSavedAccounts().filter(a => a.email !== user.email)].slice(0, 5);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage quota errors
  }
}

export function removeSavedAccount(email) {
  const next = getSavedAccounts().filter(a => a.email !== email);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage quota errors
  }
}
