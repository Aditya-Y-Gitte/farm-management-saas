import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  getPrimaryNavigation, 
  getSecondaryNavigation, 
  getActionNavigation 
} from '../../config/navigation.config';
import { useAuth } from '../../features/auth/context/AuthContext';
import './Sidebar.css';

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const { t } = useTranslation(['common', 'navigation']);
  const { logout } = useAuth();

  const primaryItems = getPrimaryNavigation();
  const secondaryItems = getSecondaryNavigation();
  const actionItems = getActionNavigation();

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <span className="sidebar__logo">🌾 {t('common:appTitle', { defaultValue: 'FarmOS' })}</span>
      </div>

      <nav className="sidebar__nav sidebar__nav--primary">
        {primaryItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path || '');
          return (
            <NavLink
              key={item.id}
              to={item.path || '#'}
              className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className="sidebar__icon" aria-hidden="true" />
              <span className="sidebar__label">{t(item.translationKey)}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar__divider" />

      <nav className="sidebar__nav sidebar__nav--secondary">
        {secondaryItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path || '');
          return (
            <NavLink
              key={item.id}
              to={item.path || '#'}
              className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className="sidebar__icon" aria-hidden="true" />
              <span className="sidebar__label">{t(item.translationKey)}</span>
            </NavLink>
          );
        })}

        {actionItems.map((item) => (
          <button
            key={item.id}
            className="sidebar__link sidebar__link--action"
            onClick={item.id === 'logout' ? logout : undefined}
          >
            <item.icon className="sidebar__icon" aria-hidden="true" />
            <span className="sidebar__label">{t(item.translationKey)}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <span className="sidebar__version">v2.0.0</span>
      </div>
    </aside>
  );
};

export default Sidebar;
