// DairyList.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDairies } from '../../services/dairyService';
import { Dairy } from '../../types/dairy';
import './Dairy.css';

interface DairyListProps {
    refresh: boolean;
}

const DairyList: React.FC<DairyListProps> = ({ refresh }) => {
    const { t } = useTranslation();
    const [dairies, setDairies] = useState<Dairy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDairies = async () => {
            setLoading(true);
            try {
                const data = await getDairies();
                setDairies(data.items || []);
            } finally {
                setLoading(false);
            }
        };
        fetchDairies();
    }, [refresh]);

    if (loading) {
        return <div className="loading-spinner"></div>;
    }

    return (
        <div className="dairy-container">
            <h2>{t('Dairy Records')}</h2>
            <div className="table-responsive">
                <table className="livestock-table">
                    <thead>
                        <tr>
                            <th>{t('Date')}</th>
                            <th>{t('Session')}</th>
                            <th>{t('Milk Yield (L)')}</th>
                            <th>{t('Fat %')}</th>
                            <th>{t('SNF %')}</th>
                            <th>{t('Quality')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dairies.map((dairy) => (
                            <tr key={dairy.id}>
                                <td>{new Date(dairy.date).toLocaleDateString()}</td>
                                <td>{t(dairy.session)}</td>
                                <td style={{ fontWeight: 600 }}>{dairy.milkYield}</td>
                                <td>{dairy.fatContent}</td>
                                <td>{dairy.snfContent}</td>
                                <td>
                                    <span className={`status-badge status-${dairy.quality.toLowerCase()}`}>
                                        {t(dairy.quality)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {dairies.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center">{t('No dairy records found.')}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DairyList;
