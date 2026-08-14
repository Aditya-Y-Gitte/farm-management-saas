import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { checkBackendHealth } from '../../services/healthService';
import { Card } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { RefreshCw } from 'lucide-react';

const HealthCheck: React.FC = () => {
  const { t } = useTranslation();
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    const healthy = await checkBackendHealth();
    setIsHealthy(healthy);
    setLoading(false);
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return (
    <Card style={{ maxWidth: 400, margin: 'var(--space-8) auto' }}>
      <Card.Header title={t('System Health')} />
      <Card.Body>
        {isHealthy === null ? (
          <Alert variant="info" title={t('Checking...')}>
            {t('Verifying backend connectivity.')}
          </Alert>
        ) : isHealthy ? (
          <Alert variant="success" title={t('Healthy')}>
            {t('Backend is connected and responding.')}
          </Alert>
        ) : (
          <Alert variant="error" title={t('Offline')}>
            {t('Backend is currently unreachable.')}
          </Alert>
        )}
      </Card.Body>
      <Card.Footer>
        <Button 
          variant="secondary" 
          onClick={checkHealth} 
          loading={loading}
          leftIcon={<RefreshCw size={16} />}
        >
          {t('Refresh')}
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default HealthCheck;
