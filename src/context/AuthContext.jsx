import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../api/client';
import { saveAccount } from '../utils/savedAccounts';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api('/auth/me');
        if (mounted) {
          setUser(data.user);
        }
      } catch {
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const data = await api('/auth/register', { method: 'POST', body: { name, email, password } });
    saveAccount(data.user);
    setUser(data.user);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const data = await api('/auth/login', { method: 'POST', body: { email, password } });
    saveAccount(data.user);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch {
      // ignore network errors on logout
    }
    setUser(null);
  }, []);

  const requestOtp = useCallback(async (email) => {
    const data = await api('/auth/otp/request', { method: 'POST', body: { email } });
    return data;
  }, []);

  const verifyOtp = useCallback(async (email, code) => {
    const data = await api('/auth/otp/verify', { method: 'POST', body: { email, code } });
    saveAccount(data.user);
    setUser(data.user);
    return data;
  }, []);

  const updateProfile = useCallback(async (fields) => {
    const data = await api('/users/me', { method: 'PATCH', body: fields });
    setUser(data.user);
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    await api('/users/me/password', {
      method: 'PATCH',
      body: { currentPassword, newPassword }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        requestOtp,
        verifyOtp,
        updateProfile,
        changePassword,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
