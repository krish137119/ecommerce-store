import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AccountTabs } from '../components/AccountTabs';
import { validateEmail, validateName, validatePhone, isStrongPassword } from '../utils/validation';
import './Profile.css';

export function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const isAdmin = user.role === 'admin';
  const [isPasswordless, setIsPasswordless] = useState(!!user.passwordless);

  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email || '',
    phone: user.phone || ''
  });
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
    setProfileMessage('');
    setProfileError('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateName(profileForm.name)) {
      setProfileError('Name must be 2-60 characters.');
      return;
    }
    if (profileForm.email && !validateEmail(profileForm.email)) {
      setProfileError('Please enter a valid email address.');
      return;
    }
    if (profileForm.phone && !validatePhone(profileForm.phone)) {
      setProfileError('Please enter a valid 10-digit mobile number.');
      return;
    }
    try {
      await updateProfile({
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone
      });
      setProfileMessage('Profile updated.');
    } catch (err) {
      setProfileError(err.message);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    setPasswordMessage('');
    setPasswordError('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword.length > 72) {
      setPasswordError('New password must be 72 characters or fewer.');
      return;
    }
    if (!isStrongPassword(passwordForm.newPassword)) {
      setPasswordError('New password must be at least 8 characters with upper, lower, number, and special characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordMessage(isPasswordless ? 'Password set. You can now sign in with it.' : 'Password changed.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsPasswordless(false);
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  return (
    <section className="profile-page">
      <div className="profile-container">
        <header className="profile-header">
          <div className="profile-avatar" aria-hidden="true">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1>{user.name}</h1>
            <p className="profile-role">
              {user.email || (user.phone ? `+91 ${user.phone}` : 'Account')} · <span className={`role-badge role-${user.role}`}>{isAdmin ? 'Admin' : 'Customer'}</span>
            </p>
          </div>
        </header>

        <AccountTabs />

        <div className="profile-settings">
          <form className="settings-card" onSubmit={handleProfileSubmit}>
            <h2>Profile Information</h2>
            <div className="form-group">
              <label htmlFor="profile-name">Full Name</label>
              <input
                id="profile-name"
                name="name"
                type="text"
                value={profileForm.name}
                onChange={handleProfileChange}
                maxLength="60"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="profile-email">Email</label>
              <input
                id="profile-email"
                name="email"
                type="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                disabled={isAdmin}
                maxLength="254"
                required
              />
              {isAdmin && <span className="field-hint">Admin email cannot be changed.</span>}
              {!isAdmin && <span className="field-hint">Your sign-in email.</span>}
            </div>
            {!isAdmin && (
              <div className="form-group">
                <label htmlFor="profile-phone">Mobile Number</label>
                <input
                  id="profile-phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  maxLength="10"
                />
                <span className="field-hint">Used for order delivery.</span>
              </div>
            )}
            {profileError && <p className="settings-error">{profileError}</p>}
            {profileMessage && <p className="settings-success">{profileMessage}</p>}
            <button type="submit" className="settings-btn">Save Changes</button>
          </form>

          <form className="settings-card" onSubmit={handlePasswordSubmit}>
            <h2>{isPasswordless ? 'Set a Password' : 'Change Password'}</h2>
            {isPasswordless && (
              <p className="field-hint">You signed in with a one-time code by email. Set a password so you can sign in without one.</p>
            )}
            {!isPasswordless && (
              <div className="form-group">
                <label htmlFor="current-password">Current Password</label>
                <input
                  id="current-password"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                  maxLength="72"
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                maxLength="72"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-new-password">Confirm New Password</label>
              <input
                id="confirm-new-password"
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                autoComplete="new-password"
                maxLength="72"
                required
              />
            </div>
            {passwordError && <p className="settings-error">{passwordError}</p>}
            {passwordMessage && <p className="settings-success">{passwordMessage}</p>}
            <button type="submit" className="settings-btn">
              {isPasswordless ? 'Set Password' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
