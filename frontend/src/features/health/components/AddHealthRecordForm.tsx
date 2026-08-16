import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createHealthRecord } from '../../../services/healthService';
import { CreateHealthRecordRequest } from '../../../types/health';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { TextArea } from '../../../components/ui/TextArea';
import { Alert } from '../../../components/ui/Alert';
import { useToast } from '../../../components/ui/ToastContext';
import { AnimalSelector } from '../../livestock/components/AnimalSelector';

export interface AddHealthRecordFormProps {
  initialLivestockId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddHealthRecordForm: React.FC<AddHealthRecordFormProps> = ({
  initialLivestockId,
  onSuccess,
  onCancel
}) => {
  const { t } = useTranslation(['health', 'common', 'animals']);
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [formState, setFormState] = useState<CreateHealthRecordRequest>({
    livestockId: initialLivestockId || '',
    date: new Date().toISOString().split('T')[0],
    type: '',
    description: '',
    diagnosis: '',
    treatment: '',
    medication: '',
    veterinarian: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateHealthRecordRequest, string>>>({});

  // Ensure livestockId stays synced if initialLivestockId changes (unlikely, but good practice)
  useEffect(() => {
    if (initialLivestockId) {
      setFormState(prev => ({ ...prev, livestockId: initialLivestockId }));
    }
  }, [initialLivestockId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof CreateHealthRecordRequest]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (apiError) setApiError(null);
  };

  const handleAnimalChange = (livestockId: string) => {
    setFormState(prev => ({ ...prev, livestockId }));
    if (errors.livestockId) {
      setErrors(prev => ({ ...prev, livestockId: undefined }));
    }
    if (apiError) setApiError(null);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateHealthRecordRequest, string>> = {};
    
    if (!formState.livestockId) {
        newErrors.livestockId = t('health:form.errors.animalRequired', { defaultValue: 'Animal selection is required' });
    }
    if (!formState.date) {
        newErrors.date = t('health:form.errors.dateRequired', { defaultValue: 'Date is required' });
    }
    if (!formState.type.trim()) {
        newErrors.type = t('health:form.errors.typeRequired', { defaultValue: 'Type is required' });
    } else if (formState.type.length > 100) {
        newErrors.type = t('health:form.errors.maxLength', { defaultValue: 'Maximum 100 characters', max: 100 });
    }
    if (formState.description && formState.description.length > 500) {
        newErrors.description = t('health:form.errors.maxLength', { defaultValue: 'Maximum 500 characters', max: 500 });
    }
    if (formState.diagnosis && formState.diagnosis.length > 200) {
        newErrors.diagnosis = t('health:form.errors.maxLength', { defaultValue: 'Maximum 200 characters', max: 200 });
    }
    if (formState.medication && formState.medication.length > 200) {
        newErrors.medication = t('health:form.errors.maxLength', { defaultValue: 'Maximum 200 characters', max: 200 });
    }
    if (formState.veterinarian && formState.veterinarian.length > 100) {
        newErrors.veterinarian = t('health:form.errors.maxLength', { defaultValue: 'Maximum 100 characters', max: 100 });
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
        await createHealthRecord(formState);
        toast.success(t('health:form.success.created', { defaultValue: 'Health record added successfully' }));
        onSuccess();
    } catch (error: any) {
        const message = error?.response?.data?.message || error.message || t('common:errors.defaultMessage');
        setApiError(message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      {apiError && (
        <div style={{ marginBottom: 'var(--space-md)' }}>
            <Alert variant="error" title={t('common:errors.title', { defaultValue: 'Error' })}>{apiError}</Alert>
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        
        <AnimalSelector 
          value={formState.livestockId}
          onChange={handleAnimalChange}
          disabled={!!initialLivestockId}
          error={errors.livestockId}
          required
        />

        <div className="grid grid-cols-2" style={{ gap: 'var(--space-md)' }}>
            <Input
                label={t('health:form.date', { defaultValue: 'Date' })}
                name="date"
                type="date"
                value={formState.date}
                onChange={handleChange}
                error={errors.date}
                required
            />
            <Input
                label={t('health:form.type', { defaultValue: 'Type (e.g. Vaccination, Illness)' })}
                name="type"
                value={formState.type}
                onChange={handleChange}
                error={errors.type}
                required
            />
        </div>

        <Input
            label={t('health:form.description', { defaultValue: 'Description' })}
            name="description"
            value={formState.description || ''}
            onChange={handleChange}
            error={errors.description}
        />

        <div className="grid grid-cols-2" style={{ gap: 'var(--space-md)' }}>
            <Input
                label={t('health:form.diagnosis', { defaultValue: 'Diagnosis' })}
                name="diagnosis"
                value={formState.diagnosis || ''}
                onChange={handleChange}
                error={errors.diagnosis}
            />
            <Input
                label={t('health:form.veterinarian', { defaultValue: 'Veterinarian' })}
                name="veterinarian"
                value={formState.veterinarian || ''}
                onChange={handleChange}
                error={errors.veterinarian}
            />
        </div>

        <Input
            label={t('health:form.medication', { defaultValue: 'Medication' })}
            name="medication"
            value={formState.medication || ''}
            onChange={handleChange}
            error={errors.medication}
        />

        <TextArea
            label={t('health:form.treatment', { defaultValue: 'Treatment Details' })}
            name="treatment"
            value={formState.treatment || ''}
            onChange={handleChange}
            error={errors.treatment}
            rows={3}
        />

        <TextArea
            label={t('health:form.notes', { defaultValue: 'Additional Notes' })}
            name="notes"
            value={formState.notes || ''}
            onChange={handleChange}
            error={errors.notes}
            rows={3}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
            <Button variant="secondary" type="button" onClick={onCancel} disabled={loading}>
                {t('common:actions.cancel', { defaultValue: 'Cancel' })}
            </Button>
            <Button type="submit" disabled={loading}>
                {loading ? t('common:loading', { defaultValue: 'Saving...' }) : t('common:actions.save', { defaultValue: 'Save Record' })}
            </Button>
        </div>
      </form>
    </>
  );
};
