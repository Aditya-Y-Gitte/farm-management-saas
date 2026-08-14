import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { checkBackendHealth } from '../../services/healthService';

const HealthCheck: React.FC = () => {
  const { t } = useTranslation();
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      const healthy = await checkBackendHealth();
      setIsHealthy(healthy);
    };

    checkHealth();
  }, []);

  return (
    <div>
      <h2>{t('Backend Health')}</h2>
      {isHealthy === null ? (
        <p>{t('Checking...')}</p>
      ) : isHealthy ? (
        <p>{t('Backend is healthy')}</p>
      ) : (
        <p>{t('Backend is not healthy')}</p>
      )}
    </div>
  );
};

export default HealthCheck;
