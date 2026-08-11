// LivestockList.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLivestocks } from '../../services/livestockService';
import { Livestock } from '../../types/livestock';
import './Livestock.css';

interface LivestockListProps {
    refresh: boolean;
}

const LivestockList: React.FC<LivestockListProps> = ({ refresh }) => {
    const { t } = useTranslation();
    const [livestocks, setLivestocks] = useState<Livestock[]>([]);

    useEffect(() => {
        const fetchLivestocks = async () => {
            const data = await getLivestocks();
            setLivestocks(data.items);
        };
        fetchLivestocks();
    }, [refresh]);

    return (
        <div className="livestock-container">
            <h2>{t('Livestock')}</h2>
            <table className="livestock-table">
                <thead>
                    <tr>
                        <th>{t('Name')}</th>
                        <th>{t('Species')}</th>
                        <th>{t('Breed')}</th>
                        <th>{t('Date of Birth')}</th>
                        <th>{t('Gender')}</th>
                    </tr>
                </thead>
                <tbody>
                    {livestocks.map((livestock) => (
                        <tr key={livestock.id}>
                            <td>{livestock.name}</td>
                            <td>{livestock.species}</td>
                            <td>{livestock.breed}</td>
                            <td>{new Date(livestock.dateOfBirth).toLocaleDateString()}</td>
                            <td>{livestock.gender}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LivestockList;
