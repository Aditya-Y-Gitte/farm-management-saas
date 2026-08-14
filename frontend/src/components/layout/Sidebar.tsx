import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getEnabledModules } from '../../config/app.config';
import './Sidebar.css';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const enabledModules = getEnabledModules();
  const { t } = useTranslation(['common', 'navigation', 'dashboard', 'animals', 'milk', 'health', 'breeding', 'finance']);

  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        {!isCollapsed && <span className="sidebar__logo">🌾 {t('common:appTitle', { defaultValue: 'FarmOS' })}</span>}
        <button className="sidebar__toggle" onClick={onToggle} aria-label="Toggle sidebar">
          {isCollapsed ? '☰' : '✕'}
        </button>
      </div>

      <nav className="sidebar__nav">
        {enabledModules.map((module) => {
          // map livestock to animals internally for the namespace key if preferred, 
          // or just ensure navigation.json has both. Let's use the module id directly.
          const nsKey = module.id === 'livestock' ? 'animals' : module.id;
          return (
            <NavLink
              key={module.id}
              to={module.path}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
              title={module.description}
            >
              <span className="sidebar__icon">{module.icon}</span>
              {!isCollapsed && <span className="sidebar__label">{t(`navigation:${nsKey}`, { defaultValue: module.label }) as React.ReactNode}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar__footer">
        {!isCollapsed && (
          <span className="sidebar__version">v2.0.0</span>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
