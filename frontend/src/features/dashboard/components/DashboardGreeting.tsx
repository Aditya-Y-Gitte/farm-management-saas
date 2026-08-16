import React from 'react';
import { useTranslation } from 'react-i18next';

const DashboardGreeting: React.FC = () => {
  const { t } = useTranslation(['dashboard']);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard:greeting.morning', { defaultValue: 'Good morning' });
    if (hour < 17) return t('dashboard:greeting.afternoon', { defaultValue: 'Good afternoon' });
    return t('dashboard:greeting.evening', { defaultValue: 'Good evening' });
  };

  return (
    <div className="dashboard__header">
      <h1>{getGreeting()}</h1>
      <span className="dashboard__updated">
        {t('dashboard:lastUpdated', { defaultValue: 'Last updated:' })} {new Date().toLocaleTimeString()}
      </span>
    </div>
  );
};

export default DashboardGreeting;
