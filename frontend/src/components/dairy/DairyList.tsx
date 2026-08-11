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

    useEffect(() => {
        const fetchDairies = async () => {
            const data = await getDairies();
            setDairies(data.items);
        };
        fetchDairies();
    }, [refresh]);

    return (
        <div className="dairy-container">
            <h2>{t('Dairy Records')}</h2>
            <table className="dairy-table">
                <thead>
                    <tr>
                        <th>{t('Date')}</th>
                        <th>{t('Milk Yield')}</th>
                        <th>{t('Fat Content')}</th>
                        <th>{t('Protein Content')}</th>
                        <th>{t('Quality')}</th>
                    </tr>
                </thead>
                <tbody>
                    {dairies.map((dairy) => (
                        <tr key={dairy.id}>
                            <td>{new Date(dairy.date).toLocaleDateString()}</td>
                            <td>{dairy.milkYield}</td>
                            <td>{dairy.fatContent}</td>
                            <td>{dairy.proteinContent}</td>
                            <td>{dairy.quality}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DairyList;
