import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validation';
import './auth.css';

export function OtpLogin() {
  const navigate = useNavigate();
  const { user, requestOtp, verifyOtp } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const from = '/';

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSend = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setIsSending(true);
    try {
      await requestOtp(email);
      setError('');
      setCodeSent(true);
      setCode('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Please enter the 6-digit code.');
      return;
    }
    setIsVerifying(true);
    try {
      await verifyOtp(email, code);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section className="auth">
      <div className="auth-card">
        <div className="auth-icon" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>
        <h1>Sign in with OTP</h1>
        <p>We'll email a one-time code to your inbox.</p>

        {!codeSent ? (
          <form onSubmit={handleSend}>
            <div className="form-group">
              <label htmlFor="otp-email">Email</label>
              <input
                id="otp-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value.trim());
                  if (error) setError('');
                }}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            {error && <span className="auth-error">{error}</span>}
            <button type="submit" className="auth-btn" disabled={isSending}>
              {isSending ? 'Sending...' : 'Send Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label htmlFor="otp-code">One-Time Code</label>
              <input
                id="otp-code"
                name="code"
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  if (error) setError('');
                }}
                className="otp-code-input"
                placeholder="••••••"
                autoComplete="one-time-code"
                required
              />
              <p className="otp-sent-to">Code sent to <strong>{email}</strong> · expires in 5 minutes</p>
            </div>

            {error && <span className="auth-error">{error}</span>}

            <button type="submit" className="auth-btn" disabled={isVerifying}>
              {isVerifying ? 'Verifying...' : 'Verify & Sign In'}
            </button>

            <div className="otp-actions">
              <button
                type="button"
                className="auth-link-btn"
                onClick={async () => {
                  try {
                    await requestOtp(email);
                    setCodeSent(true);
                    setCode('');
                    setError('');
                  } catch (err) {
                    setError(err.message);
                  }
                }}
              >
                Resend code
              </button>
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => {
                  setCodeSent(false);
                  setCode('');
                  setError('');
                }}
              >
                Change email
              </button>
            </div>
          </form>
        )}

        <p className="auth-switch">
          Instead use your password? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  );
}
