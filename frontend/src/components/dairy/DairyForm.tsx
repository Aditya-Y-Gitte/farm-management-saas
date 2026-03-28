// DairyForm.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createDairy } from '../../services/dairyService';
import { Dairy } from '../../types/dairy';
import './Dairy.css';

interface DairyFormProps {
    onDairyCreated: () => void;
}

const DairyForm: React.FC<DairyFormProps> = ({ onDairyCreated }) => {
    const { t } = useTranslation();
    const [livestockId, setLivestockId] = useState('');
    const [date, setDate] = useState('');
    const [milkYield, setMilkYield] = useState(0);
    const [fatContent, setFatContent] = useState(0);
    const [proteinContent, setProteinContent] = useState(0);
    const [quality, setQuality] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newDairy: Omit<Dairy, 'id'> = {
            livestockId,
            date,
            milkYield,
            fatContent,
            proteinContent,
            quality
        };
        await createDairy(newDairy);
        onDairyCreated();
        // clear form
        setLivestockId('');
        setDate('');
        setMilkYield(0);
        setFatContent(0);
        setProteinContent(0);
        setQuality('');
    };

    return (
        <div className="dairy-form-container">
            <h2>{t('Add Dairy Record')}</h2>
            <form onSubmit={handleSubmit} className="dairy-form">
                <div>
                    <label htmlFor="livestockId">{t('Livestock ID')}:</label>
                    <input id="livestockId" type="text" value={livestockId} onChange={(e) => setLivestockId(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="date">{t('Date')}:</label>
                    <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="milkYield">{t('Milk Yield')}:</label>
                    <input id="milkYield" type="number" value={milkYield} onChange={(e) => setMilkYield(parseFloat(e.target.value))} required />
                </div>
                <div>
                    <label htmlFor="fatContent">{t('Fat Content')}:</label>
                    <input id="fatContent" type="number" value={fatContent} onChange={(e) => setFatContent(parseFloat(e.target.value))} />
                </div>
                <div>
                    <label htmlFor="proteinContent">{t('Protein Content')}:</label>
                    <input id="proteinContent" type="number" value={proteinContent} onChange={(e) => setProteinContent(parseFloat(e.target.value))} />
                </div>
                <div>
                    <label htmlFor="quality">{t('Quality')}:</label>
                    <input id="quality" type="text" value={quality} onChange={(e) => setQuality(e.target.value)} />
                </div>
                <button type="submit">{t('Add')}</button>
            </form>
        </div>
    );
};

export default DairyForm;
