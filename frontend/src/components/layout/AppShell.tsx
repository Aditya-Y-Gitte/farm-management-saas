import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../auth/AuthContext';
import { useTranslation } from 'react-i18next';
import { registerAuthFunctions } from '../../services/apiClient';
import './AppShell.css';

const AppShell: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout, accessToken, refreshAccessToken } = useAuth();
  const { t, i18n } = useTranslation();

  // Register auth functions with the API client
  useEffect(() => {
    registerAuthFunctions(
      () => accessToken,
      refreshAccessToken
    );
  }, [accessToken, refreshAccessToken]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'app-shell--sidebar-collapsed' : ''}`}>
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="app-shell__main">
        {/* Top Bar */}
        <header className="app-shell__topbar">
          <div className="topbar__left">
            <h2 className="topbar__title">{t('Farm Management SaaS')}</h2>
          </div>

          <div className="topbar__right">
            <div className="topbar__lang">
              <button onClick={() => changeLanguage('en')} className="topbar__lang-btn">EN</button>
              <button onClick={() => changeLanguage('mr')} className="topbar__lang-btn">मराठी</button>
            </div>

            {user && (
              <div className="topbar__user">
                {user.avatarUrl && (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="topbar__avatar"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="topbar__user-info">
                  <span className="topbar__user-name">{user.displayName}</span>
                  <span className="topbar__user-role">{user.role}</span>
                </div>
                <button onClick={logout} className="topbar__logout" title="Logout">
                  🚪
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
