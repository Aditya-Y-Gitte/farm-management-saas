import React, { useState, useEffect } from 'react';
import api from '../services/api';

const HealthCheck: React.FC = () => {
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
      <h2>Backend Health</h2>
      {isHealthy === null ? (
        <p>Checking...</p>
      ) : isHealthy ? (
        <p>Backend is healthy</p>
      ) : (
        <p>Backend is not healthy</p>
      )}
    </div>
  );
};

export default HealthCheck;
