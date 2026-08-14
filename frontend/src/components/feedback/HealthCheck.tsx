import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { checkBackendHealth } from '../../services/healthService';
import { Card } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { ErrorState } from '../ui/ErrorState';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Button } from '../ui/Button';
import { RefreshCw, Power } from 'lucide-react';

const HealthCheck: React.FC = () => {
  const { t } = useTranslation();
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRestartDialogOpen, setIsRestartDialogOpen] = useState(false);

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
          <ErrorState 
            title={t('Offline')} 
            message={t('Backend is currently unreachable.')}
            onRetry={checkHealth}
            isRetrying={loading}
          />
        )}
      </Card.Body>
      <Card.Footer>
        <Button 
          variant="danger" 
          onClick={() => setIsRestartDialogOpen(true)}
          leftIcon={<Power size={16} />}
        >
          {t('Restart Backend')}
        </Button>
        <Button 
          variant="secondary" 
          onClick={checkHealth} 
          loading={loading}
          leftIcon={<RefreshCw size={16} />}
        >
          {t('Refresh')}
        </Button>
      </Card.Footer>

      <ConfirmDialog
        isOpen={isRestartDialogOpen}
        onClose={() => setIsRestartDialogOpen(false)}
        title={t('Restart Backend')}
        message={t('Are you sure you want to restart the backend? This will briefly disconnect all users.')}
        confirmText={t('Restart')}
        isDestructive={true}
        onConfirm={async () => {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          await checkHealth();
        }}
      />
    </Card>
  );
};

export default HealthCheck;
