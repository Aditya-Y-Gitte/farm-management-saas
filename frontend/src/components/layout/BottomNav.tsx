import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  getPrimaryNavigation, 
  getSecondaryNavigation, 
  getActionNavigation 
} from '../../config/navigation.config';
import { BottomSheet } from '../ui/BottomSheet';
import { MoreHorizontal } from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';
import './BottomNav.css';

const BottomNav: React.FC = () => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { t } = useTranslation(['navigation']);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const primaryItems = getPrimaryNavigation().slice(0, 4); // Show up to 4 items max
  const secondaryItems = getSecondaryNavigation();
  const actionItems = getActionNavigation();

  // Determine if a secondary item is active to highlight "More"
  const isMoreActive = secondaryItems.some(item => location.pathname.startsWith(item.path || ''));

  const handleAction = (id: string) => {
    setIsMoreOpen(false);
    if (id === 'logout') {
      logout();
    }
  };

  return (
    <>
      <nav className="bottom-nav" aria-label="Bottom Navigation">
        {primaryItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path || '');
          return (
            <NavLink
              key={item.id}
              to={item.path || '#'}
              className={`bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className="bottom-nav__icon" aria-hidden="true" />
              <span className="bottom-nav__label">{t(item.translationKey)}</span>
            </NavLink>
          );
        })}
        
        {/* More Button */}
        <button
          className={`bottom-nav__item ${isMoreActive || isMoreOpen ? 'bottom-nav__item--active' : ''}`}
          onClick={() => setIsMoreOpen(true)}
          aria-expanded={isMoreOpen}
          aria-haspopup="dialog"
        >
          <MoreHorizontal className="bottom-nav__icon" aria-hidden="true" />
          <span className="bottom-nav__label">{t('navigation:more')}</span>
        </button>
      </nav>

      {/* More Bottom Sheet */}
      <BottomSheet
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        title={t('navigation:more')}
      >
        <div className="bottom-nav__sheet-content">
          <ul className="bottom-nav__sheet-list">
            {secondaryItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path || '');
              return (
                <li key={item.id}>
                  <NavLink
                    to={item.path || '#'}
                    className={`bottom-nav__sheet-link ${isActive ? 'bottom-nav__sheet-link--active' : ''}`}
                    onClick={() => setIsMoreOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon className="bottom-nav__sheet-icon" aria-hidden="true" />
                    <span>{t(item.translationKey)}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
          
          <hr className="bottom-nav__sheet-divider" />
          
          <ul className="bottom-nav__sheet-list">
            {actionItems.map((item) => (
              <li key={item.id}>
                <button
                  className="bottom-nav__sheet-action"
                  onClick={() => handleAction(item.id)}
                >
                  <item.icon className="bottom-nav__sheet-icon" aria-hidden="true" />
                  <span>{t(item.translationKey)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </BottomSheet>
    </>
  );
};

export default BottomNav;
