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
    if (!data || data.length <= 1) {
        return null;
    }

    // Format dates for X-axis
    const formattedData = data.map(point => ({
        ...point,
        displayDate: new Date(point.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }));

    return (
        <div className="dairy-chart-container card">
            <h3>{t('milk:trends', 'Production Trends')}</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="displayDate" />
                        <YAxis yAxisId="left" />
                        <Tooltip 
                            formatter={(value: any, name: any) => {
                                if (name === 'totalMilk') return [`${Number(value).toFixed(1)} L`, t('milk:fields.yieldL') as any];
                                return [value, name];
                            }}
                            labelFormatter={(label) => label}
                        />
                        <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="totalMilk" 
                            stroke="#007bff" 
                            strokeWidth={2}
                            activeDot={{ r: 8 }} 
                            name="totalMilk"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DairyTrendsChart;
