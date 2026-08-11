import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import config from '../config/app.config';
import './LoginPage.css';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

type AuthMode = 'login' | 'register';

const LoginPage: React.FC = () => {
  const { login, localLogin, register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGoogleCallback = useCallback(async (response: any) => {
    try {
      await login(response.credential);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login failed:', error);
      setError('Google login failed. Please try again.');
    }
  }, [login, navigate]);

  // Initialize Google Sign-In button
  const googleButtonRef = useCallback((node: HTMLDivElement | null) => {
    if (node && window.google) {
      window.google.accounts.id.initialize({
        client_id: config.googleClientId,
        callback: handleGoogleCallback,
      });
      window.google.accounts.id.renderButton(node, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: 'continue_with',
        shape: 'rectangular',
      });
    }
  }, [handleGoogleCallback]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'login') {
        await localLogin(email, password);
      } else {
        await register(email, password, displayName);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__card">
        <div className="login-page__header">
          <span className="login-page__logo">🌾</span>
          <h1 className="login-page__title">Farm Management</h1>
          <p className="login-page__subtitle">
            Production-grade SaaS platform for modern farm operations
          </p>
        </div>

        <div className="login-page__auth">
          {isLoading ? (
            <div className="login-page__loading">
              <div className="loading-spinner"></div>
              <p>Authenticating...</p>
            </div>
          ) : (
            <>
              <div className="login-tabs">
                <button 
                  className={`login-tab ${mode === 'login' ? 'active' : ''}`}
                  onClick={() => { setMode('login'); setError(null); }}
                >
                  Sign In
                </button>
                <button 
                  className={`login-tab ${mode === 'register' ? 'active' : ''}`}
                  onClick={() => { setMode('register'); setError(null); }}
                >
                  Create Account
                </button>
              </div>

              {error && <div className="login-error">{error}</div>}

              <form className="login-form" onSubmit={handleSubmit}>
                {mode === 'register' && (
                  <div className="form-group">
                    <label htmlFor="displayName">Farm Name / Display Name</label>
                    <input 
                      type="text" 
                      id="displayName" 
                      className="form-control"
                      value={displayName} 
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="e.g. Green Acres Farm"
                    />
                  </div>
                )}
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="form-control"
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    placeholder="farmer@example.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    className="form-control"
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary login-submit-btn">
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="login-divider">
                <span>OR</span>
              </div>

              <div ref={googleButtonRef} className="login-page__google-btn"></div>
              <p className="login-page__disclaimer">
                Secured with OAuth 2.0 & BCrypt · Your data is encrypted
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
