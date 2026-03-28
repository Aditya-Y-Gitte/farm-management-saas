import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const HealthCheck: React.FC = () => {
  const { t } = useTranslation();
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await api.get('/health');
        if (response.status === 200) {
          setIsHealthy(true);
        } else {
          setIsHealthy(false);
        }
      } catch (error) {
        setIsHealthy(false);
      }
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
