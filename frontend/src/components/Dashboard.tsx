import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getLivestocks } from '../services/livestockService';
import { getDairies } from '../services/dairyService';
import { Livestock } from '../types/livestock';
import { Dairy } from '../types/dairy';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const { t } = useTranslation();
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
            setLivestockCount(livestockData.length);

            const today = new Date().toISOString().split('T')[0];
            const todayMilk = dairyData
                .filter(d => d.date.split('T')[0] === today)
                .reduce((acc, curr) => acc + curr.milkYield, 0);
            setTotalMilkToday(todayMilk);

            // Mock active alerts
            setActiveAlerts(3);

            // Livestock Analytics
            const livestockCountByType = livestockData.reduce((acc, curr) => {
                acc[curr.species] = (acc[curr.species] || 0) + 1;
                return acc;
            }, {} as { [key: string]: number });
            setLivestockByType(Object.entries(livestockCountByType).map(([name, count]) => ({ name, count })));

            // Dairy Analytics
            const milkByDate = dairyData.reduce((acc, curr) => {
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
                <h1>{t('Farm Dashboard')}</h1>
            </div>

            <div className="summary-cards">
                <div className="card">
                    <h3>{t('Total Livestock')}</h3>
                    <p>{livestockCount}</p>
                </div>
                <div className="card">
                    <h3>{t('Total Milk (Today)')}</h3>
                    <p>{totalMilkToday.toFixed(2)} L</p>
                </div>
                <div className="card">
                    <h3>{t('Active Alerts')}</h3>
                    <p>{activeAlerts}</p>
                </div>
            </div>

            <div className="dashboard-main">
                <div className="chart-container">
                    <h3>{t('Livestock Analytics')}</h3>
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
                    <h3>{t('Dairy Analytics')}</h3>
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
