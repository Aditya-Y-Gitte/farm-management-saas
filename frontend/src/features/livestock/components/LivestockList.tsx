// LivestockList.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getLivestocks } from '../../../services/livestockService';
import { STATUS_I18N_MAP } from '../../../utils/i18nMappings';
import { Livestock } from '../../../types/livestock';
import './Livestock.css';

interface LivestockListProps {
    refresh: boolean;
}

const LivestockList: React.FC<LivestockListProps> = ({ refresh }) => {
    const { t } = useTranslation(['common', 'navigation', 'dashboard', 'animals', 'milk', 'health', 'breeding', 'finance']);
    const [livestocks, setLivestocks] = useState<Livestock[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLivestocks = async () => {
            setLoading(true);
            try {
                const data = await getLivestocks();
                setLivestocks(data.items || []);
            } finally {
                setLoading(false);
            }
        };
        fetchLivestocks();
    }, [refresh]);

    if (loading) {
        return <div className="loading-spinner"></div>;
    }

    return (
        <div className="livestock-container">
            <h2>{t('animals:directory')}</h2>
            <div className="table-responsive">
                <table className="livestock-table">
                    <thead>
                        <tr>
                            <th>{t('animals:fields.tag')}</th>
                            <th>{t('animals:fields.name')}</th>
                            <th>{t('animals:fields.species')}</th>
                            <th>{t('animals:fields.breed')}</th>
                            <th>{t('breeding:fields.status')}</th>
                            <th>{t('common:fields.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {livestocks.map((livestock) => (
                            <tr key={livestock.id}>
                                <td>{livestock.tagNumber}</td>
                                <td>{livestock.name}</td>
                                <td>{livestock.species}</td>
                                <td>{livestock.breed}</td>
                                <td>
                                    <span className={`status-badge status-${livestock.status?.toLowerCase()}`}>
                                        {t(STATUS_I18N_MAP[livestock.status || 'Active'] || (livestock.status || 'Active') as any)}
                                    </span>
                                </td>
                                <td>
                                    <Link to={`/livestock/${livestock.id}`} className="btn btn-secondary btn-sm">
                                        {t('animals:actions.viewProfile')}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {livestocks.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center">{t('animals:empty.noLivestock')}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LivestockList;
