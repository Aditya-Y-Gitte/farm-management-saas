import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { createFeedConsumption } from '../../../services/feedService';
import { getLivestocks } from '../../../services/livestockService';
import { FEED_TYPE_I18N_MAP, FEED_UNIT_I18N_MAP } from '../../../utils/i18nMappings';
import { CreateFeedConsumptionRequest } from '../../../types/feed';
import { Livestock } from '../../../types/livestock';
import { FEED_TYPES, FEED_UNITS } from '../../../constants/appConstants';
import { getLocalCalendarDate } from '../../../utils/dateUtils';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

const FeedForm: React.FC = () => {
    const { t } = useTranslation(['feed', 'common', 'animals']);
    const navigate = useNavigate();
    
    const [livestocks, setLivestocks] = useState<Livestock[]>([]);
    const [isLoadingLivestocks, setIsLoadingLivestocks] = useState(true);
    
    const [formData, setFormData] = useState<CreateFeedConsumptionRequest>({
        livestockId: '', // Empty means herd-wide
        date: getLocalCalendarDate(),
        feedType: FEED_TYPES[0] as string,
        quantity: '' as unknown as number,
        unit: FEED_UNITS[0] as string,
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                // Bounded list for now, up to 100
                const res = await getLivestocks(1, 100);
                const activeAnimals = (res.items || []).filter(l => l.status === 'Active');
                setLivestocks(activeAnimals);
            } catch (err) {
                console.error("Failed to load livestock", err);
            } finally {
                setIsLoadingLivestocks(false);
            }
        };
        fetchAnimals();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if ((formData.quantity as any) === '' || Number(formData.quantity) <= 0) {
            setError(t('common:errors.required', { defaultValue: 'Please enter a valid quantity.' }));
            return;
        }

        setIsSubmitting(true);
        
        try {
            const requestPayload = {
                ...formData,
                livestockId: formData.livestockId === '' ? undefined : formData.livestockId,
                quantity: Number(formData.quantity)
            };
            await createFeedConsumption(requestPayload);
            navigate('/feed');
        } catch (err: any) {
            const apiMsg = err.response?.data?.message || err.message;
            setError(apiMsg || t('feed:errors.saveFailed'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <Card.Body>
                {error && <div className="alert alert-danger" style={{ marginBottom: 'var(--space-md)' }}>{error}</div>}
                
                <form onSubmit={handleSave} className="grid grid-cols-2" style={{ gap: 'var(--space-md)' }}>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label htmlFor="livestockId" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            {t('feed:fields.livestock')}
                        </label>
                        <select 
                            className="form-control" 
                            id="livestockId" 
                            name="livestockId" 
                            value={formData.livestockId} 
                            onChange={handleChange} 
                            disabled={isLoadingLivestocks || isSubmitting}
                        >
                            <option value="">{t('feed:fields.herdWide')}</option>
                            {livestocks.map(ls => (
                                <option key={ls.id} value={ls.id}>
                                    [{ls.tagNumber}] {ls.name || t('animals:unknownName', { defaultValue: 'Unnamed' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="date" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            {t('feed:fields.date')} *
                        </label>
                        <input 
                            className="form-control" 
                            id="date" 
                            name="date" 
                            type="date" 
                            value={formData.date} 
                            onChange={handleChange} 
                            disabled={isSubmitting}
                            required 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="feedType" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            {t('feed:fields.feedType')} *
                        </label>
                        <select 
                            className="form-control" 
                            id="feedType" 
                            name="feedType" 
                            value={formData.feedType} 
                            onChange={handleChange} 
                            disabled={isSubmitting}
                            required
                        >
                            {FEED_TYPES.map(type => (
                                <option key={type} value={type}>{t(FEED_TYPE_I18N_MAP[type] || type as any)}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="quantity" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            {t('feed:fields.quantity')} *
                        </label>
                        <input 
                            className="form-control" 
                            id="quantity" 
                            name="quantity" 
                            type="number" 
                            step="0.01" 
                            min="0.01"
                            inputMode="decimal"
                            value={formData.quantity} 
                            onChange={handleChange} 
                            disabled={isSubmitting}
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="unit" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            {t('feed:fields.unit')} *
                        </label>
                        <select 
                            className="form-control" 
                            id="unit" 
                            name="unit" 
                            value={formData.unit} 
                            onChange={handleChange} 
                            disabled={isSubmitting}
                            required
                        >
                            {FEED_UNITS.map(unit => (
                                <option key={unit} value={unit}>{t(FEED_UNIT_I18N_MAP[unit] || unit as any)}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label htmlFor="notes" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            {t('feed:fields.notes')} ({t('common:actions.optional')})
                        </label>
                        <textarea 
                            className="form-control" 
                            id="notes" 
                            name="notes" 
                            rows={3} 
                            value={formData.notes} 
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                    </div>
                    
                    <div style={{ gridColumn: '1 / -1', marginTop: '16px', display: 'flex', gap: '16px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                        <Button 
                            variant="secondary" 
                            onClick={() => navigate('/feed')} 
                            disabled={isSubmitting} 
                            type="button"
                        >
                            {t('common:actions.cancel')}
                        </Button>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t('common:states.saving') : t('feed:actions.save')}
                        </Button>
                    </div>
                </form>
            </Card.Body>
        </Card>
    );
};

export default FeedForm;
