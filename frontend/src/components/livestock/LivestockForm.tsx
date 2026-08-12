// LivestockForm.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createLivestock } from '../../services/livestockService';
import { CreateLivestockRequest } from '../../types/livestock';
import { LIVESTOCK_SPECIES, LIVESTOCK_GENDERS, LIVESTOCK_STATUSES, ACQUISITION_TYPES } from '../../constants/appConstants';

interface LivestockFormProps {
    onLivestockCreated: () => void;
}

const LivestockForm: React.FC<LivestockFormProps> = ({ onLivestockCreated }) => {
    const { t } = useTranslation();
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
            <h2 style={{ marginTop: 0, marginBottom: '24px' }}>{t('Add New Livestock')}</h2>
            
            {error && <div className="login-error">{error}</div>}
            
            <form onSubmit={handleSubmit} className="grid grid-cols-2">
                <div className="form-group">
                    <label htmlFor="tagNumber">{t('Tag Number (Required)')}</label>
                    <input className="form-control" id="tagNumber" name="tagNumber" type="text" value={formData.tagNumber} onChange={handleChange} required placeholder="e.g. T-1024" />
                </div>
                
                <div className="form-group">
                    <label htmlFor="name">{t('Name/Alias')}</label>
                    <input className="form-control" id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="e.g. Gauri" />
                </div>
                
                <div className="form-group">
                    <label htmlFor="species">{t('Species')}</label>
                    <select className="form-control" id="species" name="species" value={formData.species} onChange={handleChange} required>
                        {LIVESTOCK_SPECIES.map(species => (
                            <option key={species} value={species}>{t(species)}</option>
                        ))}
                    </select>
                </div>
                
                <div className="form-group">
                    <label htmlFor="breed">{t('Breed')}</label>
                    <input className="form-control" id="breed" name="breed" type="text" value={formData.breed} onChange={handleChange} placeholder="e.g. Gir, Murrah" />
                </div>
                
                <div className="form-group">
                    <label htmlFor="dateOfBirth">{t('Date of Birth')}</label>
                    <input className="form-control" id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                    <label htmlFor="gender">{t('Gender')}</label>
                    <select className="form-control" id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                        {LIVESTOCK_GENDERS.map(gender => (
                            <option key={gender} value={gender}>{t(gender)}</option>
                        ))}
                    </select>
                </div>
                
                <div className="form-group">
                    <label htmlFor="status">{t('Status')}</label>
                    <select className="form-control" id="status" name="status" value={formData.status} onChange={handleChange} required>
                        {LIVESTOCK_STATUSES.map(status => (
                            <option key={status} value={status}>{t(status)}</option>
                        ))}
                    </select>
                </div>
                
                <div className="form-group">
                    <label htmlFor="acquisitionType">{t('Acquisition Type')}</label>
                    <select className="form-control" id="acquisitionType" name="acquisitionType" value={formData.acquisitionType} onChange={handleChange} required>
                        {ACQUISITION_TYPES.map(type => (
                            <option key={type} value={type}>{t(type)}</option>
                        ))}
                    </select>
                </div>
                
                {formData.acquisitionType === 'Purchased' && (
                    <>
                        <div className="form-group">
                            <label htmlFor="purchasePrice">{t('Purchase Price (₹)')}</label>
                            <input className="form-control" id="purchasePrice" name="purchasePrice" type="number" step="0.01" value={formData.purchasePrice || ''} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="purchaseDate">{t('Purchase Date')}</label>
                            <input className="form-control" id="purchaseDate" name="purchaseDate" type="date" value={formData.purchaseDate || ''} onChange={handleChange} />
                        </div>
                    </>
                )}
                
                <div style={{ gridColumn: '1 / -1', marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ minWidth: '150px' }}>
                        {isSubmitting ? t('Saving...') : t('Save Livestock')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LivestockForm;
