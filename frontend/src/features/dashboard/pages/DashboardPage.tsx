import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCatalogSummary } from '../../../services/livestockService';
import { getDairySummary } from '../../../services/dairyService';
import { getFinanceSummary } from '../../../services/financeService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Skeleton } from '../../../components/ui/Skeleton';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ErrorState } from '../../../components/ui/ErrorState';
import './DashboardPage.css';

interface CatalogSummary {
  totalLivestock: number;
  attentionCount: number;
}

interface ProductionSummary {
  totalMilkToday: number;
  totalMilkThisWeek: number;
  totalRecords: number;
  averageFatContent: number;
  averageSnfContent: number;
}

interface FinanceSummary {
  totalIncomeThisMonth: number;
  totalExpenseThisMonth: number;
  netBalance: number;
}

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  
  const [catalog, setCatalog] = useState<{ data: CatalogSummary | null; loading: boolean; error: string | null }>({ data: null, loading: true, error: null });
  const [production, setProduction] = useState<{ data: ProductionSummary | null; loading: boolean; error: string | null }>({ data: null, loading: true, error: null });
  const [finance, setFinance] = useState<{ data: FinanceSummary | null; loading: boolean; error: string | null }>({ data: null, loading: true, error: null });

  useEffect(() => {
    const fetchAll = async () => {
      // Independent fetches
      const catalogPromise = getCatalogSummary();
      const productionPromise = getDairySummary();
      const financePromise = getFinanceSummary();

      const results = await Promise.allSettled([catalogPromise, productionPromise, financePromise]);

      // Catalog
      if (results[0].status === 'fulfilled') {
        setCatalog({ data: results[0].value, loading: false, error: null });
      } else {
        setCatalog({ data: null, loading: false, error: results[0].reason?.message || 'Failed to load catalog' });
      }

      // Production
      if (results[1].status === 'fulfilled') {
        setProduction({ data: results[1].value, loading: false, error: null });
      } else {
        setProduction({ data: null, loading: false, error: results[1].reason?.message || 'Failed to load production' });
      }

      // Finance
      if (results[2].status === 'fulfilled') {
        setFinance({ data: results[2].value, loading: false, error: null });
      } else {
        setFinance({ data: null, loading: false, error: results[2].reason?.message || 'Failed to load finance' });
      }
    };

    fetchAll();
  }, []);

  const renderMetricCard = (icon: string, label: string, value: string | number, color: string, state: { loading: boolean, error: string | null, data: any }) => {
    if (state.loading) {
      return (
        <div className="metric-card" style={{ '--accent': '#94a3b8' } as React.CSSProperties}>
           <span className="metric-card__icon">⏳</span>
           <div className="metric-card__info">
             <span className="metric-card__value">Loading...</span>
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

  const qualityData = [
    { name: 'Fat Content', value: production.data?.averageFatContent ?? 0 },
    { name: 'SNF Content', value: production.data?.averageSnfContent ?? 0 }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1>{t('Farm Dashboard')}</h1>
        <span className="dashboard__updated">
          Last updated: {new Date().toLocaleTimeString()}
        </span>
      </div>

      <div className="dashboard__cards">
        {renderMetricCard('🐄', t('Total Livestock'), catalog.data?.totalLivestock ?? 0, '#15803d', catalog)}
        {renderMetricCard('⚠️', t('Attention Needed'), catalog.data?.attentionCount ?? 0, '#ea580c', catalog)}
        {renderMetricCard('🥛', t('Milk Today'), `${(production.data?.totalMilkToday ?? 0).toFixed(1)} L`, '#0369a1', production)}
        {renderMetricCard('📅', t('Milk This Week'), `${(production.data?.totalMilkThisWeek ?? 0).toFixed(1)} L`, '#a21caf', production)}
        {renderMetricCard('💰', t('Balance'), `$${(finance.data?.netBalance ?? 0).toFixed(2)}`, '#059669', finance)}
      </div>

      <div className="dashboard__charts">
        {production.loading ? (
          <div className="chart-panel" aria-busy="true">
            <h3>{t('Average Milk Quality')}</h3>
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-end', height: '250px', padding: 'var(--space-4) 0' }}>
               <Skeleton height="60%" width="50px" />
               <Skeleton height="80%" width="50px" />
               <Skeleton height="40%" width="50px" />
               <Skeleton height="100%" width="50px" />
               <Skeleton height="70%" width="50px" />
            </div>
          </div>
        ) : production.error ? (
          <ErrorState 
            title={t('Failed to load quality data')} 
            message={production.error} 
          />
        ) : production.data?.totalRecords === 0 ? (
          <EmptyState
            title={t('No production data')}
            description={t('No milk records have been logged yet.')}
            icon={<span style={{ fontSize: '2rem' }}>🥛</span>}
          />
        ) : (
          <div className="chart-panel">
            <h3>{t('Average Milk Quality')}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={qualityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 14, fontWeight: 600 }} />
                <YAxis tick={{ fill: '#475569', fontSize: 14, fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{ background: '#ffffff', border: '2px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontWeight: 600 }}
                />
                <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
