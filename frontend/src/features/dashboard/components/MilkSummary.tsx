import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getDairyTrends } from '../../../services/dairyService';
import DairyTrendsChart from '../../dairy/components/DairyTrendsChart';

const MilkSummary: React.FC = () => {
  const { t } = useTranslation(['dashboard']);
  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const endDate = new Date().toISOString().split('T')[0]; // today
        
        const d = new Date();
        d.setDate(d.getDate() - 6);
        const startDate = d.toISOString().split('T')[0];

        const result = await getDairyTrends({ startDate, endDate });
        // The API returns points for days with production. We might need to fill in missing days if desired,
        // but the line chart can also just plot available data. To handle missing days explicitly,
        // we can generate a 7-day map.
        
        // Generate 7 days array
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }

        const filledData = days.map(dayStr => {
            const existing = result.points?.find((p: any) => p.date === dayStr);
            if (existing) return existing;
            return {
                date: dayStr,
                totalMilk: 0,
                averageFat: 0,
                averageSnf: 0,
                recordCount: 0
            };
        });

        setData(filledData);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load milk trends');
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  return (
    <div className="dashboard-section">
      <h2>{t('dashboard:sections.milk', { defaultValue: 'Milk Summary (Last 7 Days)' })}</h2>
      <DairyTrendsChart data={data} loading={loading} error={error ?? undefined} />
    </div>
  );
};

export default MilkSummary;
