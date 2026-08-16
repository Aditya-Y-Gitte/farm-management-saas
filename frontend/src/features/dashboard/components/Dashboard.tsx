import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCatalogSummary } from '../../../services/livestockService';
import { SPECIES_I18N_MAP } from '../../../utils/i18nMappings';
import { getDairySummary, getDairyTrends } from '../../../services/dairyService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { useFormatters } from '../../../utils/useFormatters';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const { t } = useTranslation(['common', 'navigation', 'dashboard', 'animals', 'milk', 'health', 'breeding', 'finance']);
    const { formatDate, formatNumber } = useFormatters();
    const [livestockCount, setLivestockCount] = useState(0);
    const [totalMilkToday, setTotalMilkToday] = useState(0);
    const [activeAlerts, setActiveAlerts] = useState(0);
    const [livestockByType, setLivestockByType] = useState<{ name: string; count: number }[]>([]);
    const [milkProductionTrend, setMilkProductionTrend] = useState<{ date: string; totalMilk: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catalogSummary, dairySummary] = await Promise.all([
                    getCatalogSummary(),
                    getDairySummary()
                ]);

                // For trends, let's fetch the last 7 days
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                
                const trends = await getDairyTrends({
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0]
                });

                // At-a-Glance Summary
                setLivestockCount(catalogSummary.totalLivestock || 0);
                setTotalMilkToday(dairySummary.totalMilkToday || 0);
                setActiveAlerts(catalogSummary.attentionCount || 0);

                // Livestock Analytics
                if (catalogSummary.speciesDistribution) {
                    const livestockByTypeArray = Object.entries(catalogSummary.speciesDistribution).map(([species, count]) => {
                        const speciesName = t(SPECIES_I18N_MAP[species] || species as any);
                        return { name: speciesName, count: count as number };
                    });
                    setLivestockByType(livestockByTypeArray);
                }

                // Dairy Analytics
                if (trends.points) {
                    const milkProductionArray = trends.points.map(p => ({
                        date: formatDate(p.date, { month: 'short', day: 'numeric' }),
                        totalMilk: p.totalMilk
                    }));
                    setMilkProductionTrend(milkProductionArray);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard summaries", err);
            }
        };

        fetchData();
    }, [formatDate, t]);

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>{t('dashboard:title')}</h1>
            </div>

            <div className="summary-cards">
                <div className="card">
                    <h3>{t('dashboard:metrics.totalLivestock')}</h3>
                    <p>{livestockCount}</p>
                </div>
                <div className="card">
                    <h3>{t('dashboard:metrics.totalMilkToday')}</h3>
                    <p>{formatNumber(totalMilkToday, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L</p>
                </div>
                <div className="card">
                    <h3>{t('dashboard:metrics.activeAlerts')}</h3>
                    <p>{activeAlerts}</p>
                </div>
            </div>

            <div className="dashboard-main">
                <div className="chart-container">
                    <h3>{t('dashboard:analytics.livestock')}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={livestockByType}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container">
                    <h3>{t('dashboard:analytics.dairy')}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={milkProductionTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="totalMilk" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
