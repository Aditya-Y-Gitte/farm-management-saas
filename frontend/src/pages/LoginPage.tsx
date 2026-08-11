import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import config from '../../config/app.config';
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

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleGoogleCallback = useCallback(async (response: any) => {
    try {
      await login(response.credential);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
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
        theme: 'filled_black',
        size: 'large',
        width: 320,
        text: 'continue_with',
        shape: 'pill',
      });
    }
  }, [handleGoogleCallback]);

  return (
    <div className="login-page">
      <div className="login-page__background">
        <div className="login-page__orb login-page__orb--1"></div>
        <div className="login-page__orb login-page__orb--2"></div>
        <div className="login-page__orb login-page__orb--3"></div>
      </div>

      <div className="login-page__card">
        <div className="login-page__header">
          <span className="login-page__logo">🌾</span>
          <h1 className="login-page__title">Farm Management</h1>
          <p className="login-page__subtitle">
            Production-grade SaaS platform for modern farm operations
          </p>
        </div>

        <div className="login-page__features">
          <div className="login-page__feature">
            <span>🐄</span>
            <span>Livestock Tracking</span>
          </div>
          <div className="login-page__feature">
            <span>🥛</span>
            <span>Dairy Analytics</span>
          </div>
          <div className="login-page__feature">
            <span>📊</span>
            <span>Real-time Dashboard</span>
          </div>
        </div>

        <div className="login-page__auth">
          {isLoading ? (
            <div className="login-page__loading">
              <div className="loading-spinner"></div>
              <p>Authenticating...</p>
            </div>
          ) : (
            <>
              <div ref={googleButtonRef} className="login-page__google-btn"></div>
              <p className="login-page__disclaimer">
                Secured with Google OAuth 2.0 · Your data is encrypted and isolated
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
