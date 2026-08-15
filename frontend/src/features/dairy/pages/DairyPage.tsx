import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DairyList from '../components/DairyList';
import DairyFilters from '../components/DairyFilters';
import DairyTrendsChart from '../components/DairyTrendsChart';
import { getDairyTrends } from '../../../services/dairyService';
import { DairyTrendPointDto } from '../../../types/dairy';
import '../../../theme/PageCommon.css';

const DairyPage: React.FC = () => {
    const { t } = useTranslation(['common', 'navigation', 'dashboard', 'animals', 'milk', 'health', 'breeding', 'finance']);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [trendData, setTrendData] = useState<DairyTrendPointDto[]>([]);
    const [trendLoading, setTrendLoading] = useState(false);
    const [trendError, setTrendError] = useState('');

    const filters = {
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined,
        livestockId: searchParams.get('livestockId') || undefined,
        session: searchParams.get('session') || undefined,
    };

    const handleFiltersChange = (newFilters: any) => {
        const params = new URLSearchParams(searchParams);
        
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) {
                params.set(key, value as string);
            } else {
                params.delete(key);
            }
        });
        
        setSearchParams(params);
    };

    useEffect(() => {
        if (filters.startDate && filters.endDate) {
            setTrendLoading(true);
            setTrendError('');
            getDairyTrends({ 
                startDate: filters.startDate, 
                endDate: filters.endDate,
                livestockId: filters.livestockId,
                session: filters.session
            })
            .then(res => setTrendData(res.points))
            .catch(err => setTrendError(err.message || 'Failed to load trends'))
            .finally(() => setTrendLoading(false));
        } else {
            setTrendData([]);
        }
    }, [filters.startDate, filters.endDate, filters.livestockId, filters.session]);

    return (
        <div className="page">
            <div className="page__header">
                <h1>🥛 {t('milk:title')}</h1>
                <button className="page__action-btn" onClick={() => navigate('/dairy/record')}>
                    {`+ ${t('milk:addLog')}`}
                </button>
            </div>

            <DairyFilters filters={filters} onFiltersChange={handleFiltersChange} />
            
            <DairyTrendsChart data={trendData} loading={trendLoading} error={trendError} />

            <DairyList filters={filters} />
        </div>
    );
};

export default DairyPage;
