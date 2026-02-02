'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface SSOUser {
  uid: string;
  email: string;
  name?: string;
  picture?: string;
  emailVerified?: boolean;
}

interface AuthContextType {
  user: SSOUser | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  refreshSession: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SSOUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      // Check session from cookies
      const userInfoCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user_info='));

      if (userInfoCookie) {
        const userInfo = JSON.parse(decodeURIComponent(userInfoCookie.split('=')[1]));
        setUser(userInfo);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Session check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    setLoading(true);
    await checkSession();
  };

  useEffect(() => {
    checkSession();

    // Refresh session every 5 minutes
    const interval = setInterval(checkSession, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshSession }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
