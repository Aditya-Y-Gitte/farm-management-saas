// DairyForm.tsx
import React, { useState } from 'react';
import { createDairy } from '../../services/dairyService';
import { Dairy } from '../../types/dairy';

interface DairyFormProps {
    onDairyCreated: () => void;
}

const DairyForm: React.FC<DairyFormProps> = ({ onDairyCreated }) => {
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
        <div>
            <h2>Add Dairy Record</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Livestock ID:
                    <input type="text" value={livestockId} onChange={(e) => setLivestockId(e.target.value)} required />
                </label>
                <label>
                    Date:
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </label>
                <label>
                    Milk Yield:
                    <input type="number" value={milkYield} onChange={(e) => setMilkYield(parseFloat(e.target.value))} required />
                </label>
                <label>
                    Fat Content:
                    <input type="number" value={fatContent} onChange={(e) => setFatContent(parseFloat(e.target.value))} />
                </label>
                <label>
                    Protein Content:
                    <input type="number" value={proteinContent} onChange={(e) => setProteinContent(parseFloat(e.target.value))} />
                </label>
                <label>
                    Quality:
                    <input type="text" value={quality} onChange={(e) => setQuality(e.target.value)} />
                </label>
                <button type="submit">Add</button>
            </form>
        </div>
    );
};

export default DairyForm;
