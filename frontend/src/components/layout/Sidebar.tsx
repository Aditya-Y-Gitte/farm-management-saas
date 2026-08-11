import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getEnabledModules } from '../../config/app.config';
import './Sidebar.css';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const enabledModules = getEnabledModules();

  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        {!isCollapsed && <span className="sidebar__logo">🌾 FarmOS</span>}
        <button className="sidebar__toggle" onClick={onToggle} aria-label="Toggle sidebar">
          {isCollapsed ? '☰' : '✕'}
        </button>
      </div>

      <nav className="sidebar__nav">
        {enabledModules.map((module) => (
          <NavLink
            key={module.id}
            to={module.path}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
            title={module.description}
          >
            <span className="sidebar__icon">{module.icon}</span>
            {!isCollapsed && <span className="sidebar__label">{module.label}</span>}
          </NavLink>
        ))}
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
