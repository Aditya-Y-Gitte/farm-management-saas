// LivestockForm.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createLivestock } from '../../../services/livestockService';
import { SPECIES_I18N_MAP, GENDER_I18N_MAP, STATUS_I18N_MAP, ACQUISITION_I18N_MAP } from '../../../utils/i18nMappings';
import { CreateLivestockRequest } from '../../../types/livestock';
import { LIVESTOCK_SPECIES, LIVESTOCK_GENDERS, LIVESTOCK_STATUSES, ACQUISITION_TYPES } from '../../../constants/appConstants';

interface LivestockFormProps {
    onLivestockCreated: () => void;
}

const LivestockForm: React.FC<LivestockFormProps> = ({ onLivestockCreated }) => {
    const { t } = useTranslation(['common', 'navigation', 'dashboard', 'animals', 'milk', 'health', 'breeding', 'finance']);
    const [formData, setFormData] = useState<CreateLivestockRequest>({
        tagNumber: '',
        name: '',
        species: LIVESTOCK_SPECIES[0],
        breed: '',
        dateOfBirth: '',
        gender: LIVESTOCK_GENDERS[0],
        status: LIVESTOCK_STATUSES[0],
        acquisitionType: ACQUISITION_TYPES[0],
        purchasePrice: undefined,
        purchaseDate: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'purchasePrice' ? (value ? Number(value) : undefined) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await createLivestock(formData);
            onLivestockCreated();
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="livestock-form-container">
            <h2 style={{ marginTop: 0, marginBottom: '24px' }}>{t('animals:actions.addNew')}</h2>
            
            {error && <div className="login-error">{error}</div>}
            
            <form onSubmit={handleSubmit} className="grid grid-cols-2">
                <div className="form-group">
                    <label htmlFor="tagNumber">{t('animals:fields.tagRequired')}</label>
                    <input className="form-control" id="tagNumber" name="tagNumber" type="text" value={formData.tagNumber} onChange={handleChange} required placeholder="e.g. T-1024" />
                </div>
                
                <div className="form-group">
                    <label htmlFor="name">{t('animals:fields.nameAlias')}</label>
                    <input className="form-control" id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="e.g. Gauri" />
                </div>
                
                <div className="form-group">
                    <label htmlFor="species">{t('animals:fields.species')}</label>
                    <select className="form-control" id="species" name="species" value={formData.species} onChange={handleChange} required>
                        {LIVESTOCK_SPECIES.map(species => (
                            <option key={species} value={species}>{t(SPECIES_I18N_MAP[species] || species as any)}</option>
                        ))}
                    </select>
                </div>
                
                <div className="form-group">
                    <label htmlFor="breed">{t('animals:fields.breed')}</label>
                    <input className="form-control" id="breed" name="breed" type="text" value={formData.breed} onChange={handleChange} placeholder="e.g. Gir, Murrah" />
                </div>
                
                <div className="form-group">
                    <label htmlFor="dateOfBirth">{t('animals:fields.dob')}</label>
                    <input className="form-control" id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                    <label htmlFor="gender">{t('animals:fields.gender')}</label>
                    <select className="form-control" id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                        {LIVESTOCK_GENDERS.map(gender => (
                            <option key={gender} value={gender}>{t(GENDER_I18N_MAP[gender] || gender as any)}</option>
                        ))}
                    </select>
                </div>
                
                <div className="form-group">
                    <label htmlFor="status">{t('breeding:fields.status')}</label>
                    <select className="form-control" id="status" name="status" value={formData.status} onChange={handleChange} required>
                        {LIVESTOCK_STATUSES.map(status => (
                            <option key={status} value={status}>{t(STATUS_I18N_MAP[status] || status as any)}</option>
                        ))}
                    </select>
                </div>
                
                <div className="form-group">
                    <label htmlFor="acquisitionType">{t('animals:fields.acquisitionType')}</label>
                    <select className="form-control" id="acquisitionType" name="acquisitionType" value={formData.acquisitionType} onChange={handleChange} required>
                        {ACQUISITION_TYPES.map(type => (
                            <option key={type} value={type}>{t(ACQUISITION_I18N_MAP[type] || type as any)}</option>
                        ))}
                    </select>
                </div>
                
                {formData.acquisitionType === 'Purchased' && (
                    <>
                        <div className="form-group">
                            <label htmlFor="purchasePrice">{t('animals:fields.purchasePriceRs')}</label>
                            <input className="form-control" id="purchasePrice" name="purchasePrice" type="number" step="0.01" value={formData.purchasePrice || ''} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="purchaseDate">{t('animals:fields.purchaseDate')}</label>
                            <input className="form-control" id="purchaseDate" name="purchaseDate" type="date" value={formData.purchaseDate || ''} onChange={handleChange} />
                        </div>
                    </>
                )}
                
                <div style={{ gridColumn: '1 / -1', marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ minWidth: '150px' }}>
                        {isSubmitting ? t('common:states.saving') : t('animals:actions.save')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LivestockForm;
