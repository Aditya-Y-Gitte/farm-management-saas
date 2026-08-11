import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import config from '../config/app.config';

// --- Types ---
export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  tenantId: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: (googleIdToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
}

// --- Context ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Provider ---
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!accessToken;

  // Try to restore session on mount via refresh token (httpOnly cookie)
  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const response = await fetch(`${config.apiGatewayUrl}/api/auth/refresh`, {
          method: 'POST',
          credentials: 'include', // sends httpOnly cookie
        });

        if (response.ok) {
          const data = await response.json();
          setAccessToken(data.accessToken);

          // Fetch user profile
          const meResponse = await fetch(`${config.apiGatewayUrl}/api/auth/me`, {
            headers: { Authorization: `Bearer ${data.accessToken}` },
          });

          if (meResponse.ok) {
            const userData = await meResponse.json();
            setUser(userData);
          }
        }
      } catch {
        // Silent fail — user is not authenticated
      } finally {
        setIsLoading(false);
      }
    };

    tryRefresh();
  }, []);

  const login = useCallback(async (googleIdToken: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.apiGatewayUrl}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idToken: googleIdToken }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      setAccessToken(data.accessToken);
      setUser(data.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${config.apiGatewayUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });
    } catch {
      // Best effort
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  }, [accessToken]);

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const response = await fetch(`${config.apiGatewayUrl}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        return data.accessToken;
      }
    } catch {
      // Refresh failed
    }

    // Refresh failed — log the user out
    setUser(null);
    setAccessToken(null);
    return null;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, accessToken, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Hook ---
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
