import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCatalogAlerts, getLivestockBatch } from '../../../services/livestockService';
import { getDairyAlerts } from '../../../services/dairyService';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { Link } from 'react-router-dom';

interface ActionableIssue {
  livestockId: string;
  livestockName: string;
  tagNumber: string;
  alertType: string;
  date: string;
  priority: number;
  message: string;
}

const NeedsAttention: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'animals']);
  
  const [issues, setIssues] = useState<ActionableIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        // 1. Fetch domain alerts concurrently but independently
        const results = await Promise.allSettled([
          getCatalogAlerts(5),
          getDairyAlerts(5)
        ]);

        const catalogRes = results[0].status === 'fulfilled' ? results[0].value : { items: [] };
        const dairyRes = results[1].status === 'fulfilled' ? results[1].value : { items: [] };

        // If both failed, we throw an error to show the ErrorState
        if (results[0].status === 'rejected' && results[1].status === 'rejected') {
          throw new Error('Failed to load alerts from both Catalog and Dairy services');
        }

        const allAlerts = [
          ...(catalogRes.items || []),
          ...(dairyRes.items || [])
        ];

        if (allAlerts.length === 0) {
          setIssues([]);
          setError(null);
          return;
        }

        // 2. Collect unique livestock IDs
        const uniqueLivestockIds = Array.from(new Set(allAlerts.map(a => a.livestockId)));

        // 3. Fetch livestock details
        const livestocks = await getLivestockBatch(uniqueLivestockIds);
        const livestockMap = new Map(livestocks.map(l => [l.id, l]));

        // 4. Normalize to ActionableIssue
        const normalizedIssues: ActionableIssue[] = allAlerts.map(alert => {
          const livestock = livestockMap.get(alert.livestockId);
          const livestockName = livestock?.name || 'Unknown';
          const tagNumber = livestock?.tagNumber || '???';
          
          let priority = 99;
          let message = alert.alertType;

          if (alert.alertType === 'LivestockSick') {
            priority = 1;
            message = t('dashboard:alerts.livestockSick', { defaultValue: 'Reported sick' });
          } else if (alert.alertType === 'LivestockNeedsAttention') {
            priority = 2;
            message = t('dashboard:alerts.livestockNeedsAttention', { defaultValue: 'Needs attention based on status' });
          } else if (alert.alertType === 'MilkDrop') {
            priority = 3;
            const dropPercent = (((alert.baselineValue - alert.currentValue) / alert.baselineValue) * 100).toFixed(0);
            message = t('dashboard:alerts.milkDrop', { 
              defaultValue: 'Milk production dropped {{percent}}% today vs baseline',
              percent: dropPercent
            });
          }

          return {
            livestockId: alert.livestockId,
            livestockName,
            tagNumber,
            alertType: alert.alertType,
            date: alert.date,
            priority,
            message
          };
        });

        // 5. Sort by priority, then by date (newest first)
        normalizedIssues.sort((a, b) => {
          if (a.priority !== b.priority) {
            return a.priority - b.priority;
          }
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setIssues(normalizedIssues.slice(0, 5));
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load actionable issues');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [t]);

  return (
    <div className="dashboard-section chart-panel">
      <h2>{t('dashboard:sections.attention', { defaultValue: 'Needs Attention' })}</h2>
      
      {loading ? (
        <div className="dashboard-loading">{t('common:loading', { defaultValue: 'Loading...' })}</div>
      ) : error ? (
        <ErrorState title="Error" message={error} />
      ) : issues.length === 0 ? (
        <EmptyState
          title={t('dashboard:empty.noAttention', { defaultValue: 'All good!' })}
          description={t('dashboard:empty.noAttentionDesc', { defaultValue: 'No actionable issues detected.' })}
          icon={<span style={{ fontSize: '2rem' }}>✨</span>}
        />
      ) : (
        <div className="attention-list">
          {issues.map((issue, idx) => (
            <div key={`${issue.livestockId}-${issue.alertType}-${idx}`} className={`attention-card status-${issue.priority === 1 ? 'sick' : issue.priority === 2 ? 'needs-attention' : 'anomaly'}`}>
              <div className="attention-card-header">
                <strong>[{issue.tagNumber}] {issue.livestockName}</strong>
                <span className="attention-status-badge">{issue.alertType === 'MilkDrop' ? 'Anomaly' : issue.alertType.replace('Livestock', '')}</span>
              </div>
              <div className="attention-card-body">
                <p>{issue.message}</p>
                <Link to={`/livestock/${issue.livestockId}`} className="btn btn-secondary btn-sm">
                  {t('dashboard:actions.viewAnimal', { defaultValue: 'View animal →' })}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NeedsAttention;
