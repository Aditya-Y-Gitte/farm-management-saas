import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createBreedingCycle } from '../../../services/breedingService';
import { CreateBreedingCycleRequest, BREEDING_STATUS, BREEDING_METHOD } from '../../../types/breeding';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { TextArea } from '../../../components/ui/TextArea';
import { Alert } from '../../../components/ui/Alert';
import { useToast } from '../../../components/ui/ToastContext';
import '../../../theme/PageCommon.css';

const AddBreedingRecordPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation(['breeding', 'common', 'animals']);
    const toast = useToast();

    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const [formState, setFormState] = useState<CreateBreedingCycleRequest>({
        livestockId: id || '',
        breedingDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        method: BREEDING_METHOD.ARTIFICIAL_INSEMINATION,
        status: BREEDING_STATUS.INSEMINATED,
        expectedDeliveryDate: '',
        actualDeliveryDate: '',
        notes: ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CreateBreedingCycleRequest, string>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
        
        if (errors[name as keyof CreateBreedingCycleRequest]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
        if (apiError) setApiError(null);
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof CreateBreedingCycleRequest, string>> = {};
        
        if (!formState.breedingDate) {
            newErrors.breedingDate = t('breeding:form.errors.dateRequired', { defaultValue: 'Date is required' });
        }
        
        if (formState.expectedDeliveryDate && formState.expectedDeliveryDate < formState.breedingDate) {
            newErrors.expectedDeliveryDate = t('breeding:form.errors.deliveryBeforeBreeding', { defaultValue: 'Delivery cannot be before breeding date' });
        }
        if (formState.actualDeliveryDate && formState.actualDeliveryDate < formState.breedingDate) {
            newErrors.actualDeliveryDate = t('breeding:form.errors.deliveryBeforeBreeding', { defaultValue: 'Delivery cannot be before breeding date' });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validate()) {
            return;
        }

        setLoading(true);
        setApiError(null);
        
        try {
            await createBreedingCycle({
                ...formState,
                // ensure empty strings for dates are converted to undefined/omitted
                expectedDeliveryDate: formState.expectedDeliveryDate || undefined,
                actualDeliveryDate: formState.actualDeliveryDate || undefined,
            });
            toast.success(t('breeding:form.success.created', { defaultValue: 'Breeding record added successfully' }));
            navigate(`/livestock/${id}`);
        } catch (error: any) {
            const message = error?.response?.data?.message || error.message || t('common:errors.defaultMessage');
            setApiError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="page__header">
                <div>
                    <h1>{t('breeding:timeline.addRecord', { defaultValue: 'Add Breeding Record' })}</h1>
                </div>
                <Button variant="secondary" onClick={() => navigate(`/livestock/${id}`)} disabled={loading}>
                    {t('common:actions.cancel', { defaultValue: 'Cancel' })}
                </Button>
            </div>

            <Card style={{ maxWidth: '600px', margin: '0 auto', marginTop: 'var(--space-md)' }}>
                <Card.Body>
                    {apiError && (
                        <div style={{ marginBottom: 'var(--space-md)' }}>
                            <Alert variant="error" title={t('common:errors.title', { defaultValue: 'Error' })}>{apiError}</Alert>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        <div className="grid grid-cols-2" style={{ gap: 'var(--space-md)' }}>
                            <Input
                                label={t('breeding:form.breedingDate', { defaultValue: 'Breeding Date' })}
                                name="breedingDate"
                                type="date"
                                value={formState.breedingDate}
                                onChange={handleChange}
                                error={errors.breedingDate}
                                required
                            />
                            
                            <div className="ui-input-group">
                                <label className="ui-label">{t('breeding:form.method', { defaultValue: 'Method' })}</label>
                                <select 
                                    className="ui-input" 
                                    name="method" 
                                    value={formState.method} 
                                    onChange={handleChange}
                                >
                                    <option value={BREEDING_METHOD.ARTIFICIAL_INSEMINATION}>{t('breeding:method.ai', { defaultValue: 'Artificial Insemination' })}</option>
                                    <option value={BREEDING_METHOD.NATURAL}>{t('breeding:method.natural', { defaultValue: 'Natural' })}</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2" style={{ gap: 'var(--space-md)' }}>
                            <div className="ui-input-group">
                                <label className="ui-label">{t('breeding:form.status', { defaultValue: 'Status' })}</label>
                                <select 
                                    className="ui-input" 
                                    name="status" 
                                    value={formState.status} 
                                    onChange={handleChange}
                                >
                                    <option value={BREEDING_STATUS.INSEMINATED}>{t('breeding:status.inseminated', { defaultValue: 'Inseminated' })}</option>
                                    <option value={BREEDING_STATUS.PREGNANT}>{t('breeding:status.pregnant', { defaultValue: 'Pregnant' })}</option>
                                    <option value={BREEDING_STATUS.DELIVERED}>{t('breeding:status.delivered', { defaultValue: 'Delivered' })}</option>
                                    <option value={BREEDING_STATUS.FAILED}>{t('breeding:status.failed', { defaultValue: 'Failed' })}</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2" style={{ gap: 'var(--space-md)' }}>
                            <Input
                                label={t('breeding:form.expectedDeliveryDate', { defaultValue: 'Expected Delivery Date' })}
                                name="expectedDeliveryDate"
                                type="date"
                                value={formState.expectedDeliveryDate || ''}
                                onChange={handleChange}
                                error={errors.expectedDeliveryDate}
                            />
                            <Input
                                label={t('breeding:form.actualDeliveryDate', { defaultValue: 'Actual Delivery Date' })}
                                name="actualDeliveryDate"
                                type="date"
                                value={formState.actualDeliveryDate || ''}
                                onChange={handleChange}
                                error={errors.actualDeliveryDate}
                            />
                        </div>

                        <TextArea
                            label={t('breeding:form.notes', { defaultValue: 'Notes' })}
                            name="notes"
                            value={formState.notes || ''}
                            onChange={handleChange}
                            error={errors.notes}
                            rows={3}
                        />

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-sm)' }}>
                            <Button type="submit" disabled={loading}>
                                {loading ? t('common:loading', { defaultValue: 'Saving...' }) : t('common:actions.save', { defaultValue: 'Save Record' })}
                            </Button>
                        </div>
                    </form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default AddBreedingRecordPage;
