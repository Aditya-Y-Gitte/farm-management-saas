// DairyList.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDairies } from '../../../services/dairyService';
import { DAIRY_SESSION_I18N_MAP, DAIRY_QUALITY_I18N_MAP } from '../../../utils/i18nMappings';
import { Dairy } from '../../../types/dairy';
import './Dairy.css';

interface DairyListProps {
    refresh: boolean;
}

const DairyList: React.FC<DairyListProps> = ({ refresh }) => {
    const { t } = useTranslation(['common', 'navigation', 'dashboard', 'animals', 'milk', 'health', 'breeding', 'finance']);
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
            <h2>{t('milk:records')}</h2>
            <div className="table-responsive">
                <table className="livestock-table">
                    <thead>
                        <tr>
                            <th>{t('milk:fields.date')}</th>
                            <th>{t('milk:fields.session')}</th>
                            <th>{t('milk:fields.yieldL')}</th>
                            <th>{t('milk:fields.fatP')}</th>
                            <th>{t('milk:fields.snfP')}</th>
                            <th>{t('milk:fields.quality')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dairies.map((dairy) => (
                            <tr key={dairy.id}>
                                <td>{new Date(dairy.date).toLocaleDateString()}</td>
                                <td>{t(DAIRY_SESSION_I18N_MAP[dairy.session] || dairy.session as any)}</td>
                                <td style={{ fontWeight: 600 }}>{dairy.milkYield}</td>
                                <td>{dairy.fatContent}</td>
                                <td>{dairy.snfContent}</td>
                                <td>
                                    <span className={`status-badge status-${dairy.quality.toLowerCase()}`}>
                                        {t(DAIRY_QUALITY_I18N_MAP[dairy.quality] || dairy.quality as any)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {dairies.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center">{t('milk:empty.noRecords')}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DairyList;
