import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { createDairy } from '../../../services/dairyService';
import { getLivestocks } from '../../../services/livestockService';
import { DAIRY_SESSION_I18N_MAP, DAIRY_QUALITY_I18N_MAP } from '../../../utils/i18nMappings';
import { CreateDairyRequest } from '../../../types/dairy';
import { Livestock } from '../../../types/livestock';
import { DAIRY_SESSIONS, DAIRY_QUALITIES } from '../../../constants/appConstants';
import { getLocalCalendarDate } from '../../../utils/dateUtils';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import './Dairy.css';

interface DairyRecordFormProps {
    onSaved?: () => void;
}

const getDefaultSession = () => {
    const hour = new Date().getHours();
    return hour < 14 ? 'Morning' : 'Evening';
};

const DairyRecordForm: React.FC<DairyRecordFormProps> = ({ onSaved }) => {
    const { t } = useTranslation(['milk', 'common', 'animals']);
    
    // Core state
    const [livestocks, setLivestocks] = useState<Livestock[]>([]);
    const [isLoadingLivestocks, setIsLoadingLivestocks] = useState(true);
    
    const [formData, setFormData] = useState<CreateDairyRequest>({
        livestockId: '',
        date: getLocalCalendarDate(),
        session: getDefaultSession(),
        milkYield: '' as unknown as number, // Start empty for better UX
        fatContent: '' as unknown as number,
        snfContent: '' as unknown as number,
        quality: DAIRY_QUALITIES[1] // 'Good'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    
    const animalSelectRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                // Temporary bounded list: fetch up to 100 active livestock
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
        }));
    };

    const submitRecord = async (onSuccess: () => void) => {
        setError(null);
        setSuccessMsg(null);
        setIsSubmitting(true);
        
        try {
            await createDairy({
                ...formData,
                milkYield: Number(formData.milkYield) || 0,
                fatContent: Number(formData.fatContent) || 0,
                snfContent: Number(formData.snfContent) || 0
            });
            onSuccess();
        } catch (err: any) {
            // Handle 409 Duplicate specifically if standard ApiError format is used
            const status = err.response?.status;
            const apiMsg = err.response?.data?.message || err.message;
            
            if (status === 409) {
                setError(t('milk:record.errors.duplicate', { defaultValue: 'A milk record already exists for this animal, date, and session.' }));
            } else {
                setError(apiMsg || t('common:errors.defaultMessage', { defaultValue: 'An error occurred' }));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!formData.livestockId || (formData.milkYield as any) === '' || Number(formData.milkYield) <= 0) {
            setError(t('milk:record.errors.required', { defaultValue: 'Animal and valid Milk Yield (>0) are required.' }));
            return;
        }
        submitRecord(() => {
            if (onSaved) onSaved();
        });
    };

    const handleSaveAndContinue = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!formData.livestockId || (formData.milkYield as any) === '' || Number(formData.milkYield) <= 0) {
            setError(t('milk:record.errors.required', { defaultValue: 'Animal and valid Milk Yield (>0) are required.' }));
            return;
        }
        submitRecord(() => {
            setSuccessMsg(t('milk:record.success.savedAndContinue', { defaultValue: 'Record saved successfully. Ready for next entry.' }));
            
            // Retain date & session, reset animal and yield data
            setFormData(prev => ({
                ...prev,
                livestockId: '',
                milkYield: '' as unknown as number,
                fatContent: '' as unknown as number,
                snfContent: '' as unknown as number,
                quality: DAIRY_QUALITIES[1]
            }));
            
            // Focus next animal for rapid entry
            if (animalSelectRef.current) {
                animalSelectRef.current.focus();
            }
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMsg(null), 3000);
        });
    };

    return (
        <Card>
            <Card.Body>
                {error && <div className="alert alert-danger" style={{ marginBottom: 'var(--space-md)', padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: '4px' }}>{error}</div>}
                {successMsg && <div className="alert alert-success" style={{ marginBottom: 'var(--space-md)', padding: '12px', background: '#dcfce3', color: '#166534', borderRadius: '4px' }}>{successMsg}</div>}
                
                <form className="grid grid-cols-2" style={{ gap: 'var(--space-md)' }}>
                    
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label htmlFor="livestockId" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            {t('milk:record.animal', { defaultValue: 'Animal' })}
                        </label>
                        <select 
                            ref={animalSelectRef}
                            className="form-control" 
                            id="livestockId" 
                            name="livestockId" 
                            value={formData.livestockId} 
                            onChange={handleChange} 
                            disabled={isLoadingLivestocks || isSubmitting}
                            required
                        >
                            <option value="" disabled>
                                {isLoadingLivestocks ? t('common:loading', { defaultValue: 'Loading...' }) : t('milk:record.selectAnimal', { defaultValue: '-- Select Animal --' })}
                            </option>
                            {livestocks.map(ls => (
                                <option key={ls.id} value={ls.id}>
                                    [{ls.tagNumber}] {ls.name || t('animals:unknownName', { defaultValue: 'Unnamed' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="date" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            {t('milk:record.date', { defaultValue: 'Date' })}
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
                        <label htmlFor="session" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            {t('milk:record.session', { defaultValue: 'Session' })}
                        </label>
                        <select 
                            className="form-control" 
                            id="session" 
                            name="session" 
                            value={formData.session} 
                            onChange={handleChange} 
                            disabled={isSubmitting}
                            required
                        >
                            {DAIRY_SESSIONS.map(session => (
                                <option key={session} value={session}>{t(DAIRY_SESSION_I18N_MAP[session] || session as any)}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="milkYield" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            {t('milk:record.yield', { defaultValue: 'Yield (Liters)' })}
                        </label>
                        <input 
                            className="form-control" 
                            id="milkYield" 
                            name="milkYield" 
                            type="number" 
                            step="0.1" 
                            min="0.1"
                            inputMode="decimal"
                            pattern="[0-9]*"
                            value={formData.milkYield} 
                            onChange={handleChange} 
                            disabled={isSubmitting}
                            placeholder="e.g. 12.5"
                            required 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="fatContent" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            {t('milk:record.fat', { defaultValue: 'Fat %' })}
                        </label>
                        <input 
                            className="form-control" 
                            id="fatContent" 
                            name="fatContent" 
                            type="number" 
                            step="0.1" 
                            min="0"
                            max="100"
                            inputMode="decimal"
                            pattern="[0-9]*"
                            value={formData.fatContent} 
                            onChange={handleChange}
                            disabled={isSubmitting} 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="snfContent" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            {t('milk:record.snf', { defaultValue: 'SNF %' })}
                        </label>
                        <input 
                            className="form-control" 
                            id="snfContent" 
                            name="snfContent" 
                            type="number" 
                            step="0.1" 
                            min="0"
                            max="100"
                            inputMode="decimal"
                            pattern="[0-9]*"
                            value={formData.snfContent} 
                            onChange={handleChange}
                            disabled={isSubmitting} 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="quality" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            {t('milk:fields.quality', { defaultValue: 'Quality' })}
                        </label>
                        <select 
                            className="form-control" 
                            id="quality" 
                            name="quality" 
                            value={formData.quality} 
                            onChange={handleChange}
                            disabled={isSubmitting}
                        >
                            {DAIRY_QUALITIES.map(quality => (
                                <option key={quality} value={quality}>{t(DAIRY_QUALITY_I18N_MAP[quality] || quality as any)}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div style={{ gridColumn: '1 / -1', marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                        <Button 
                            variant="secondary" 
                            onClick={handleSave} 
                            disabled={isSubmitting} 
                            style={{ minWidth: '120px' }}
                        >
                            {isSubmitting ? t('common:states.saving') : t('milk:record.actions.save', { defaultValue: 'Save' })}
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={handleSaveAndContinue} 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t('common:states.saving') : t('milk:record.actions.saveAndContinue', { defaultValue: 'Save & Continue' })}
                        </Button>
                    </div>
                </form>
            </Card.Body>
        </Card>
    );
};

export default DairyRecordForm;
