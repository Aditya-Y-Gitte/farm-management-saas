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
  const { t } = useTranslation(['common', 'navigation', 'dashboard', 'animals', 'milk', 'health', 'breeding', 'finance']);
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
      <Card.Header title={t('health:backendHealth')} />
      <Card.Body>
        {isHealthy === null ? (
          <Alert variant="info" title={t('common:states.loading')}>
            {t('health:verifyingConnectivity')}
          </Alert>
        ) : isHealthy ? (
          <Alert variant="success" title={t('health:backendHealthy')}>
            {t('health:backendConnected')}
          </Alert>
        ) : (
          <ErrorState 
            title={t('health:backendNotHealthy')} 
            message={t('health:backendUnreachable')}
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
          {t('health:restartBackend')}
        </Button>
        <Button 
          variant="secondary" 
          onClick={checkHealth} 
          loading={loading}
          leftIcon={<RefreshCw size={16} />}
        >
          {t('common:actions.retry', { defaultValue: 'Refresh' })}
        </Button>
      </Card.Footer>

      <ConfirmDialog
        isOpen={isRestartDialogOpen}
        onClose={() => setIsRestartDialogOpen(false)}
        title={t('health:restartBackend')}
        message={t('health:restartBackendMessage')}
        confirmText={t('health:restartBackend')}
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
