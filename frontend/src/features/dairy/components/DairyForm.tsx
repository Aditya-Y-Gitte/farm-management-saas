// DairyForm.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createDairy } from '../../../services/dairyService';
import { DAIRY_SESSION_I18N_MAP, DAIRY_QUALITY_I18N_MAP } from '../../../utils/i18nMappings';
import { CreateDairyRequest } from '../../../types/dairy';
import { DAIRY_SESSIONS, DAIRY_QUALITIES } from '../../../constants/appConstants';
import './Dairy.css';

interface DairyFormProps {
    onDairyCreated: () => void;
}

const DairyForm: React.FC<DairyFormProps> = ({ onDairyCreated }) => {
    const { t } = useTranslation(['common', 'navigation', 'dashboard', 'animals', 'milk', 'health', 'breeding', 'finance']);
    const [formData, setFormData] = useState<CreateDairyRequest>({
        livestockId: '',
        date: '',
        session: DAIRY_SESSIONS[0],
        milkYield: 0,
        fatContent: 0,
        snfContent: 0,
        quality: DAIRY_QUALITIES[1] // 'Good'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await createDairy(formData);
            onDairyCreated();
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="dairy-form-container">
            <h2 style={{ marginTop: 0, marginBottom: '24px' }}>{t('milk:addRecord')}</h2>
            
            {error && <div className="login-error">{error}</div>}
            
            <form onSubmit={handleSubmit} className="grid grid-cols-2">
                <div className="form-group">
                    <label htmlFor="livestockId">{t('animals:fields.id')}</label>
                    <input className="form-control" id="livestockId" name="livestockId" type="text" value={formData.livestockId} onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                    <label htmlFor="date">{t('milk:fields.date')}</label>
                    <input className="form-control" id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                    <label htmlFor="session">{t('milk:fields.session')}</label>
                    <select className="form-control" id="session" name="session" value={formData.session} onChange={handleChange} required>
                        {DAIRY_SESSIONS.map(session => (
                            <option key={session} value={session}>{t(DAIRY_SESSION_I18N_MAP[session] || session as any)}</option>
                        ))}
                    </select>
                </div>
                
                <div className="form-group">
                    <label htmlFor="milkYield">{t('milk:fields.yieldLiters')}</label>
                    <input className="form-control" id="milkYield" name="milkYield" type="number" step="0.1" value={formData.milkYield || ''} onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                    <label htmlFor="fatContent">{t('milk:fields.fatPercent')}</label>
                    <input className="form-control" id="fatContent" name="fatContent" type="number" step="0.1" value={formData.fatContent || ''} onChange={handleChange} />
                </div>
                
                <div className="form-group">
                    <label htmlFor="snfContent">{t('milk:fields.snfPercent')}</label>
                    <input className="form-control" id="snfContent" name="snfContent" type="number" step="0.1" value={formData.snfContent || ''} onChange={handleChange} />
                </div>
                
                <div className="form-group">
                    <label htmlFor="quality">{t('milk:fields.quality')}</label>
                    <select className="form-control" id="quality" name="quality" value={formData.quality} onChange={handleChange}>
                        {DAIRY_QUALITIES.map(quality => (
                            <option key={quality} value={quality}>{t(DAIRY_QUALITY_I18N_MAP[quality] || quality as any)}</option>
                        ))}
                    </select>
                </div>
                
                <div style={{ gridColumn: '1 / -1', marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ minWidth: '150px' }}>
                        {isSubmitting ? t('common:states.saving') : t('milk:actions.saveRecord')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DairyForm;
