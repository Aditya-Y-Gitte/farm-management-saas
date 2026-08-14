import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createLivestock } from '../../../services/livestockService';
import { CreateLivestockRequest } from '../../../types/livestock';
import { LIVESTOCK_SPECIES, LIVESTOCK_GENDERS, LIVESTOCK_STATUSES, ACQUISITION_TYPES } from '../../../constants/appConstants';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { useToast } from '../../../components/ui/ToastContext';
import { ApiError } from '../../../services/apiClient';
import '../../../theme/PageCommon.css';

const AddLivestockPage: React.FC = () => {
    const { t } = useTranslation(['animals', 'common']);
    const navigate = useNavigate();
    const toast = useToast();

    const [formData, setFormData] = useState<CreateLivestockRequest>({
        tagNumber: '',
        name: '',
        species: LIVESTOCK_SPECIES[0] || '',
        breed: '',
        dateOfBirth: new Date().toISOString().split('T')[0], // Default to today
        gender: LIVESTOCK_GENDERS[0] || '',
        status: LIVESTOCK_STATUSES[0] || '',
        acquisitionType: ACQUISITION_TYPES[0] || '',
        purchasePrice: undefined,
        purchaseDate: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            
            // Clear purchase data if acquisition type changes away from 'Purchased'
            if (name === 'acquisitionType' && value !== 'Purchased') {
                newData.purchasePrice = undefined;
                newData.purchaseDate = '';
            }
            
            // Format number fields
            if (name === 'purchasePrice') {
                newData.purchasePrice = value ? Number(value) : undefined;
            }
            
            return newData;
        });

        // Clear field error when user types
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (serverError) {
            setServerError(null);
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.tagNumber.trim()) {
            errors.tagNumber = t('animals:form.errors.tagRequired');
        }

        if (!formData.species) {
            errors.species = t('animals:form.errors.speciesRequired');
        }

        if (!formData.gender) {
            errors.gender = t('animals:form.errors.genderRequired');
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setServerError(null);
        setIsSubmitting(true);

        try {
            await createLivestock(formData);
            toast.success(t('animals:form.success.created'));
            navigate('/livestock');
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                if (err.status === 409) {
                    setServerError(t('animals:form.errors.duplicateTag'));
                    setFieldErrors(prev => ({ ...prev, tagNumber: t('animals:form.errors.duplicateTag') }));
                } else {
                    setServerError(err.message || t('animals:form.errors.serverError'));
                }
            } else if (err instanceof Error) {
                setServerError(err.message);
            } else {
                setServerError(t('animals:form.errors.serverError'));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="page__header" style={{ marginBottom: 'var(--space-6)' }}>
                <h1>{t('animals:form.title')}</h1>
            </div>

            <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
                {serverError && (
                    <Alert 
                        variant="error" 
                        title={t('common:errors.title', { defaultValue: 'Error' })} 
                        style={{ marginBottom: 'var(--space-6)' }}
                    >
                        {serverError}
                    </Alert>
                )}

                <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    
                    <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: 'var(--text-lg)', fontWeight: 600 }}>
                        {t('animals:sections.general')}
                    </h3>

                    <Input
                        id="tagNumber"
                        name="tagNumber"
                        label={t('animals:form.tagNumber')}
                        value={formData.tagNumber}
                        onChange={handleChange}
                        required
                        error={fieldErrors.tagNumber}
                        placeholder="e.g. T-1024"
                        disabled={isSubmitting}
                    />

                    <Input
                        id="name"
                        name="name"
                        label={t('animals:form.name')}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Gauri"
                        disabled={isSubmitting}
                    />

                    <Select
                        id="species"
                        name="species"
                        label={t('animals:form.species')}
                        value={formData.species}
                        onChange={handleChange}
                        required
                        error={fieldErrors.species}
                        disabled={isSubmitting}
                    >
                        <option value="" disabled>{t('common:selectOption', { defaultValue: 'Select...' })}</option>
                        {LIVESTOCK_SPECIES.map(species => (
                            <option key={species} value={species}>{t(`animals:species.${species.toLowerCase()}`, { defaultValue: species })}</option>
                        ))}
                    </Select>

                    <Input
                        id="breed"
                        name="breed"
                        label={t('animals:form.breed')}
                        value={formData.breed}
                        onChange={handleChange}
                        placeholder="e.g. Gir, Murrah"
                        disabled={isSubmitting}
                    />

                    <Select
                        id="gender"
                        name="gender"
                        label={t('animals:form.gender')}
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        error={fieldErrors.gender}
                        disabled={isSubmitting}
                    >
                        <option value="" disabled>{t('common:selectOption', { defaultValue: 'Select...' })}</option>
                        {LIVESTOCK_GENDERS.map(gender => (
                            <option key={gender} value={gender}>{t(`animals:gender.${gender.toLowerCase()}`, { defaultValue: gender })}</option>
                        ))}
                    </Select>

                    <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        label={t('animals:form.dateOfBirth')}
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        disabled={isSubmitting}
                    />

                    <Select
                        id="status"
                        name="status"
                        label={t('animals:form.status')}
                        value={formData.status}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                    >
                        {LIVESTOCK_STATUSES.map(status => (
                            <option key={status} value={status}>{t(`animals:status.${status.toLowerCase()}`, { defaultValue: status })}</option>
                        ))}
                    </Select>

                    <h3 style={{ margin: 'var(--space-4) 0 var(--space-2) 0', fontSize: 'var(--text-lg)', fontWeight: 600 }}>
                        {t('animals:sections.acquisition')}
                    </h3>

                    <Select
                        id="acquisitionType"
                        name="acquisitionType"
                        label={t('animals:form.acquisitionType')}
                        value={formData.acquisitionType}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                    >
                        {ACQUISITION_TYPES.map(type => (
                            <option key={type} value={type}>{t(`animals:source.${type.toLowerCase()}`, { defaultValue: type })}</option>
                        ))}
                    </Select>

                    {formData.acquisitionType === 'Purchased' && (
                        <>
                            <Input
                                id="purchasePrice"
                                name="purchasePrice"
                                type="number"
                                step="0.01"
                                label={t('animals:form.purchasePrice')}
                                value={formData.purchasePrice || ''}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                            
                            <Input
                                id="purchaseDate"
                                name="purchaseDate"
                                type="date"
                                label={t('animals:form.purchaseDate')}
                                value={formData.purchaseDate || ''}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                        </>
                    )}

                    <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
                        <Button 
                            type="button" 
                            variant="secondary" 
                            onClick={() => navigate(-1)}
                            disabled={isSubmitting}
                            style={{ flex: 1 }}
                        >
                            {t('common:actions.cancel')}
                        </Button>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            loading={isSubmitting}
                            style={{ flex: 1 }}
                        >
                            {t('animals:actions.save')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLivestockPage;
