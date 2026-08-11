// LivestockForm.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createLivestock } from '../../services/livestockService';
import { Livestock } from '../../types/livestock';
import './Livestock.css';

interface LivestockFormProps {
    onLivestockCreated: () => void;
}

const LivestockForm: React.FC<LivestockFormProps> = ({ onLivestockCreated }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [breed, setBreed] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [healthStatus, setHealthStatus] = useState('');
    const [medication, setMedication] = useState('');
    const [vaccination, setVaccination] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newLivestock: Omit<Livestock, 'id'> = {
            name,
            species,
            breed,
            dateOfBirth,
            gender,
            healthStatus,
            medication,
            vaccination
        };
        await createLivestock(newLivestock);
        onLivestockCreated();
        // clear form
        setName('');
        setSpecies('');
        setBreed('');
        setDateOfBirth('');
        setGender('');
        setHealthStatus('');
        setMedication('');
        setVaccination('');
    };

    return (
        <div className="livestock-form-container">
            <h2>{t('Add Livestock')}</h2>
            <form onSubmit={handleSubmit} className="livestock-form">
                <div className="form-group">
                    <label htmlFor="name">{t('Name:')}</label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="species">{t('Species:')}</label>
                    <input id="species" type="text" value={species} onChange={(e) => setSpecies(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="breed">{t('Breed:')}</label>
                    <input id="breed" type="text" value={breed} onChange={(e) => setBreed(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="dateOfBirth">{t('Date of Birth:')}</label>
                    <input id="dateOfBirth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="gender">{t('Gender:')}</label>
                    <input id="gender" type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="healthStatus">{t('Health Status:')}</label>
                    <input id="healthStatus" type="text" value={healthStatus} onChange={(e) => setHealthStatus(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="medication">{t('Medication:')}</label>
                    <input id="medication" type="text" value={medication} onChange={(e) => setMedication(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="vaccination">{t('Vaccination:')}</label>
                    <input id="vaccination" type="text" value={vaccination} onChange={(e) => setVaccination(e.target.value)} />
                </div>
                <button type="submit" className="btn-primary">{t('Add')}</button>
            </form>
        </div>
    );
};

export default LivestockForm;
