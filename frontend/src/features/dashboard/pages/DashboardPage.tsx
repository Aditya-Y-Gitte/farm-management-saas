import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCatalogSummary } from '../../../services/livestockService';
import { getDairySummary } from '../../../services/dairyService';
import { getFinanceSummary } from '../../../services/financeService';
import DashboardGreeting from '../components/DashboardGreeting';
import DashboardOverview from '../components/DashboardOverview';
import QuickActions from '../components/QuickActions';
import NeedsAttention from '../components/NeedsAttention';
import MilkSummary from '../components/MilkSummary';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation(['dashboard']);
  
  const [catalog, setCatalog] = useState<{ data: any | null; loading: boolean; error: string | null }>({ data: null, loading: true, error: null });
  const [production, setProduction] = useState<{ data: any | null; loading: boolean; error: string | null }>({ data: null, loading: true, error: null });
  const [finance, setFinance] = useState<{ data: any | null; loading: boolean; error: string | null }>({ data: null, loading: true, error: null });

  useEffect(() => {
    const fetchAll = async () => {
      // Independent fetches
      const catalogPromise = getCatalogSummary();
      const productionPromise = getDairySummary();
      const financePromise = getFinanceSummary();

      const results = await Promise.allSettled([catalogPromise, productionPromise, financePromise]);

      if (results[0].status === 'fulfilled') {
        setCatalog({ data: results[0].value, loading: false, error: null });
      } else {
        setCatalog({ data: null, loading: false, error: results[0].reason?.message || 'Failed to load catalog' });
      }

      if (results[1].status === 'fulfilled') {
        setProduction({ data: results[1].value, loading: false, error: null });
      } else {
        setProduction({ data: null, loading: false, error: results[1].reason?.message || 'Failed to load production' });
      }

      if (results[2].status === 'fulfilled') {
        setFinance({ data: results[2].value, loading: false, error: null });
      } else {
        setFinance({ data: null, loading: false, error: results[2].reason?.message || 'Failed to load finance' });
      }
    };

    fetchAll();
  }, []);

  return (
    <div className="dashboard">
      <DashboardGreeting />
      <DashboardOverview catalog={catalog} production={production} />
      <QuickActions />
      <NeedsAttention />
      <MilkSummary />
      
      <div className="dashboard-section">
        <h2>{t('dashboard:sections.additional', { defaultValue: 'Additional Information' })}</h2>
        <div className="dashboard__cards">
          <div className="metric-card" style={{ '--accent': '#059669' } as React.CSSProperties}>
            <span className="metric-card__icon">💰</span>
            <div className="metric-card__info">
              {finance.loading ? (
                 <span className="metric-card__value">...</span>
              ) : finance.error ? (
                 <span className="metric-card__value" style={{ fontSize: '1rem', color: '#ef4444' }}>Error</span>
              ) : (
                 <span className="metric-card__value">${(finance.data?.netBalance ?? 0).toFixed(2)}</span>
              )}
              <span className="metric-card__label">{t('dashboard:metrics.balance', { defaultValue: 'Net Balance' })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
