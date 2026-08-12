// LivestockList.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getLivestocks } from '../../services/livestockService';
import { Livestock } from '../../types/livestock';
import './Livestock.css';

interface LivestockListProps {
    refresh: boolean;
}

const LivestockList: React.FC<LivestockListProps> = ({ refresh }) => {
    const { t } = useTranslation();
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
            <h2>{t('Livestock Directory')}</h2>
            <div className="table-responsive">
                <table className="livestock-table">
                    <thead>
                        <tr>
                            <th>{t('Tag Number')}</th>
                            <th>{t('Name')}</th>
                            <th>{t('Species')}</th>
                            <th>{t('Breed')}</th>
                            <th>{t('Status')}</th>
                            <th>{t('Actions')}</th>
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
                                        {t(livestock.status || 'Active')}
                                    </span>
                                </td>
                                <td>
                                    <Link to={`/livestock/${livestock.id}`} className="btn btn-secondary btn-sm">
                                        {t('View Profile')}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {livestocks.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center">{t('No livestock found.')}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LivestockList;
