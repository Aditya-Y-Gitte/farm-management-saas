import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAttentionLivestocks } from '../../../services/livestockService';
import { Livestock } from '../../../types/livestock';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ErrorState } from '../../../components/ui/ErrorState';

const NeedsAttention: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'animals']);
  
  const [data, setData] = useState<{ items: Livestock[], totalCount: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttention = async () => {
      try {
        const result = await getAttentionLivestocks(5);
        setData(result);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load attention list');
      } finally {
        setLoading(false);
      }
    };

    fetchAttention();
  }, []);

  return (
    <div className="dashboard-section chart-panel">
      <h2>{t('dashboard:sections.attention', { defaultValue: 'Needs Attention' })}</h2>
      
      {loading ? (
        <div className="dashboard-loading">{t('common:loading', { defaultValue: 'Loading...' })}</div>
      ) : error ? (
        <ErrorState title="Error" message={error} />
      ) : data?.totalCount === 0 ? (
        <EmptyState
          title={t('dashboard:empty.noAttention', { defaultValue: 'All good!' })}
          description={t('dashboard:empty.noAttentionDesc', { defaultValue: 'No animals require immediate attention.' })}
          icon={<span style={{ fontSize: '2rem' }}>✨</span>}
        />
      ) : (
        <div className="attention-list">
          {data?.items.map(animal => (
            <div key={animal.id} className={`attention-card status-${animal.status.toLowerCase().replace(' ', '-')}`}>
              <div className="attention-card-header">
                <strong>[{animal.tagNumber}] {animal.name}</strong>
                <span className="attention-status-badge">{animal.status}</span>
              </div>
            </div>
          ))}
          {data && data.totalCount > data.items.length && (
             <div className="attention-more">
               + {data.totalCount - data.items.length} more...
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NeedsAttention;
