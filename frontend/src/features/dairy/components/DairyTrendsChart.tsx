import React from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DairyTrendPointDto } from '../../../types/dairy';
import './Dairy.css';

interface DairyTrendsChartProps {
    data: DairyTrendPointDto[];
    loading?: boolean;
    error?: string;
}

const DairyTrendsChart: React.FC<DairyTrendsChartProps> = ({ data, loading, error }) => {
    const { t } = useTranslation(['common', 'milk']);

    if (loading) {
        return (
            <div className="dairy-chart-container card">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dairy-chart-container card">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    // "Hide for single-day range" per requirement
    if (data && data.length === 1) {
        return null;
    }

    const hasData = data && data.length > 0 && data.some(d => d.totalMilk > 0);

    if (!hasData) {
        return (
            <div className="dairy-chart-container card empty-state">
                <h3>{t('milk:trends', 'Production Trends')}</h3>
                <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#6b7280' }}>
                    <p style={{ margin: 0, fontSize: '0.875rem' }}>
                        {t('milk:noData', 'No milk production data available for this period.')}
                    </p>
                </div>
            </div>
        );
    }

    // Format dates for X-axis
    const formattedData = data.map(point => ({
        ...point,
        displayDate: new Date(point.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }));

    return (
        <div className="dairy-chart-container card">
            <h3>{t('milk:trends', 'Production Trends')}</h3>
            <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                    <LineChart data={formattedData} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                            dataKey="displayDate" 
                            tick={{ fontSize: 12 }} 
                            tickMargin={10} 
                            minTickGap={20}
                        />
                        <YAxis 
                            yAxisId="left" 
                            tick={{ fontSize: 12 }} 
                            tickMargin={10}
                            label={{ 
                                value: t('milk:fields.yieldL', 'Yield (L)') as string, 
                                angle: -90, 
                                position: 'insideLeft', 
                                style: { textAnchor: 'middle', fontSize: 12, fill: '#6b7280' },
                                dx: -10 
                            }}
                        />
                        <Tooltip 
                            formatter={(value: any, name: any) => {
                                if (name === 'totalMilk') return [`${Number(value).toFixed(1)} L`, t('milk:fields.yieldL', 'Yield (L)') as any];
                                return [value, name];
                            }}
                            labelFormatter={(label) => label}
                        />
                        <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="totalMilk" 
                            stroke="#0284c7" 
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#0284c7', strokeWidth: 0 }}
                            activeDot={{ r: 6 }} 
                            name="totalMilk"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DairyTrendsChart;
