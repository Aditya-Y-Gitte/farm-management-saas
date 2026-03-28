// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { getLivestocks } from '../services/livestockService';
import { getDairies } from '../services/dairyService';
import { Livestock } from '../types/livestock';
import { Dairy } from '../types/dairy';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const [livestockCount, setLivestockCount] = useState(0);
    const [averageMilkYield, setAverageMilkYield] = useState(0);
    const [livestockBySpecies, setLivestockBySpecies] = useState<{ name: string; count: number }[]>([]);
    const [milkYieldOverTime, setMilkYieldOverTime] = useState<{ date: string; milkYield: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const livestockData = await getLivestocks();
            const dairyData = await getDairies();

            // Calculate total livestock
            setLivestockCount(livestockData.length);

            // Calculate average milk yield
            if (dairyData.length > 0) {
                const totalMilkYield = dairyData.reduce((acc, curr) => acc + curr.milkYield, 0);
                setAverageMilkYield(totalMilkYield / dairyData.length);
            }

            // Group livestock by species
            const speciesCount = livestockData.reduce((acc, curr) => {
                acc[curr.species] = (acc[curr.species] || 0) + 1;
                return acc;
            }, {} as { [key: string]: number });
            setLivestockBySpecies(Object.entries(speciesCount).map(([name, count]) => ({ name, count })));

            // Group milk yield by date
            const milkYieldByDate = dairyData.map(d => ({
                date: new Date(d.date).toLocaleDateString(),
                milkYield: d.milkYield
            }));
            setMilkYieldOverTime(milkYieldByDate);
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            <div className="dashboard-summary">
                <div className="summary-card">
                    <h3>Total Livestock</h3>
                    <p>{livestockCount}</p>
                </div>
                <div className="summary-card">
                    <h3>Average Milk Yield</h3>
                    <p>{averageMilkYield.toFixed(2)} L</p>
                </div>
            </div>
            <div className="charts-container">
                <div className="chart">
                    <h3>Livestock by Species</h3>
                    <BarChart width={400} height={300} data={livestockBySpecies}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#2c6e49" />
                    </BarChart>
                </div>
                <div className="chart">
                    <h3>Milk Yield Over Time</h3>
                    <LineChart width={400} height={300} data={milkYieldOverTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="milkYield" stroke="#f5b700" />
                    </LineChart>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
