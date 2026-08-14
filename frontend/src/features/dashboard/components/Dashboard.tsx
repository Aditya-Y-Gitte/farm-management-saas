import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getLivestocks } from '../../../services/livestockService';
import { SPECIES_I18N_MAP } from '../../../utils/i18nMappings';
import { getDairies } from '../../../services/dairyService';
import { Livestock } from '../../../types/livestock';
import { Dairy } from '../../../types/dairy';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const { t } = useTranslation(['common', 'navigation', 'dashboard', 'animals', 'milk', 'health', 'breeding', 'finance']);
    const [livestockCount, setLivestockCount] = useState(0);
    const [totalMilkToday, setTotalMilkToday] = useState(0);
    const [activeAlerts, setActiveAlerts] = useState(0);
    const [livestockByType, setLivestockByType] = useState<{ name: string; count: number }[]>([]);
    const [milkProductionTrend, setMilkProductionTrend] = useState<{ date: string; totalMilk: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const livestockData = await getLivestocks();
            const dairyData = await getDairies();

            // At-a-Glance Summary
            setLivestockCount(livestockData.items.length);

            const today = new Date().toISOString().split('T')[0];
            const todayMilk = dairyData.items
                .filter(d => d.date.split('T')[0] === today)
                .reduce((acc, curr) => acc + curr.milkYield, 0);
            setTotalMilkToday(todayMilk);

            // Mock active alerts
            setActiveAlerts(3);

            // Livestock Analytics
            const livestockCountByType = livestockData.items.reduce((acc, curr) => {
                const speciesName = t(SPECIES_I18N_MAP[curr.species] || curr.species as any);
                acc[speciesName] = (acc[speciesName] || 0) + 1;
                return acc;
            }, {} as { [key: string]: number });
            setLivestockByType(Object.entries(livestockCountByType).map(([name, count]) => ({ name, count })));

            // Dairy Analytics
            const milkByDate = dairyData.items.reduce((acc, curr) => {
                const date = new Date(curr.date).toLocaleDateString();
                acc[date] = (acc[date] || 0) + curr.milkYield;
                return acc;
            }, {} as { [key: string]: number });
            setMilkProductionTrend(Object.entries(milkByDate).map(([date, totalMilk]) => ({ date, totalMilk })));
        };

        fetchData();
    }, []);

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
                    <p>{totalMilkToday.toFixed(2)} L</p>
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
