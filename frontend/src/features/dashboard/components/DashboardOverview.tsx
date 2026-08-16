import React from 'react';
import { useTranslation } from 'react-i18next';

interface SummaryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface DashboardOverviewProps {
  catalog: SummaryState<any>;
  production: SummaryState<any>;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ catalog, production }) => {
  const { t } = useTranslation(['dashboard']);

  const renderMetricCard = (icon: string, label: string, value: string | number, color: string, state: SummaryState<any>) => {
    if (state.loading) {
      return (
        <div className="metric-card" style={{ '--accent': '#94a3b8' } as React.CSSProperties}>
           <span className="metric-card__icon">⏳</span>
           <div className="metric-card__info">
             <span className="metric-card__value">...</span>
             <span className="metric-card__label">{label}</span>
           </div>
        </div>
      );
    }
    
    if (state.error) {
      return (
        <div className="metric-card" style={{ '--accent': '#ef4444' } as React.CSSProperties}>
           <span className="metric-card__icon">⚠️</span>
           <div className="metric-card__info">
             <span className="metric-card__value" style={{ fontSize: '1rem', color: '#ef4444' }}>Error</span>
             <span className="metric-card__label">{label}</span>
           </div>
        </div>
      );
    }

    return (
      <div className="metric-card" style={{ '--accent': color } as React.CSSProperties}>
        <span className="metric-card__icon">{icon}</span>
        <div className="metric-card__info">
          <span className="metric-card__value">{value}</span>
          <span className="metric-card__label">{label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-section">
      <h2>{t('dashboard:sections.overview', { defaultValue: 'Today\'s Overview' })}</h2>
      <div className="dashboard__cards">
        {renderMetricCard('🐄', t('dashboard:metrics.totalLivestock', { defaultValue: 'Total Animals' }), catalog.data?.totalLivestock ?? 0, '#15803d', catalog)}
        {renderMetricCard('🥛', t('dashboard:metrics.totalMilkToday', { defaultValue: 'Milk Today' }), `${(production.data?.totalMilkToday ?? 0).toFixed(1)} L`, '#0369a1', production)}
        {renderMetricCard('⚠️', t('dashboard:metrics.activeAlerts', { defaultValue: 'Attention Needed' }), catalog.data?.attentionCount ?? 0, '#ea580c', catalog)}
      </div>
    </div>
  );
};

export default DashboardOverview;
