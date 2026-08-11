import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import apiClient from '../../services/apiClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import './DashboardPage.css';

interface FarmMetrics {
  livestock: {
    totalLivestock: number;
  };
  dairy: {
    totalMilkToday: number;
    totalMilkThisWeek: number;
    totalRecords: number;
    averageFatContent: number;
    averageProteinContent: number;
  };
  aggregatedAt: string;
}

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<FarmMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await apiClient.get('/api/gateway/metrics');
        setMetrics(response.data);
      } catch (err: any) {
        setError(err?.response?.data?.detail || 'Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading farm metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h3>⚠️ {error}</h3>
        <p>The metrics aggregation endpoint may not be available yet. Add some data first!</p>
      </div>
    );
  }

  const summaryCards = [
    {
      icon: '🐄',
      label: t('Total Livestock'),
      value: metrics?.livestock?.totalLivestock ?? 0,
      color: '#66BB6A'
    },
    {
      icon: '🥛',
      label: t('Milk Today'),
      value: `${(metrics?.dairy?.totalMilkToday ?? 0).toFixed(1)} L`,
      color: '#4FC3F7'
    },
    {
      icon: '📅',
      label: t('Milk This Week'),
      value: `${(metrics?.dairy?.totalMilkThisWeek ?? 0).toFixed(1)} L`,
      color: '#AB47BC'
    },
    {
      icon: '📊',
      label: t('Dairy Records'),
      value: metrics?.dairy?.totalRecords ?? 0,
      color: '#FFB74D'
    }
  ];

  const qualityData = [
    { name: 'Fat Content', value: metrics?.dairy?.averageFatContent ?? 0 },
    { name: 'Protein Content', value: metrics?.dairy?.averageProteinContent ?? 0 }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1>{t('Farm Dashboard')}</h1>
        <span className="dashboard__updated">
          Last updated: {metrics?.aggregatedAt ? new Date(metrics.aggregatedAt).toLocaleTimeString() : '—'}
        </span>
      </div>

      <div className="dashboard__cards">
        {summaryCards.map((card, i) => (
          <div key={i} className="metric-card" style={{ '--accent': card.color } as React.CSSProperties}>
            <span className="metric-card__icon">{card.icon}</span>
            <div className="metric-card__info">
              <span className="metric-card__value">{card.value}</span>
              <span className="metric-card__label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard__charts">
        <div className="chart-panel">
          <h3>{t('Average Milk Quality')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={qualityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0' }}
              />
              <Bar dataKey="value" fill="#4FC3F7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
