import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
const QuickActions: React.FC = () => {
  const { t } = useTranslation(['dashboard']);
  const navigate = useNavigate();

  const actions = [
    {
      label: t('dashboard:actions.recordMilk', { defaultValue: 'Record Milk' }),
      icon: '🥛',
      path: '/dairy/record'
    },
    {
      label: t('dashboard:actions.addAnimal', { defaultValue: 'Add Animal' }),
      icon: '🐄',
      path: '/livestock/add'
    },
    {
      label: t('dashboard:actions.recordTreatment', { defaultValue: 'Record Treatment' }),
      icon: '⚕️',
      path: '/health/record'
    },
    {
      label: t('dashboard:actions.viewAnimals', { defaultValue: 'View Animals' }),
      icon: '📋',
      path: '/livestock'
    }
  ];

  return (
    <div className="dashboard-section">
      <h2>{t('dashboard:sections.actions', { defaultValue: 'Quick Actions' })}</h2>
      <div className="quick-actions-grid">
        {actions.map((action, idx) => (
          <button 
            key={idx} 
            className="quick-action-btn" 
            onClick={() => navigate(action.path)}
          >
            <span className="quick-action-icon">{action.icon}</span>
            <span className="quick-action-label">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
