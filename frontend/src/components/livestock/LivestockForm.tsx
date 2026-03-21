// LivestockForm.tsx
import React, { useState } from 'react';
import { createLivestock } from '../../services/livestockService';
import { Livestock } from '../../types/livestock';

interface LivestockFormProps {
    onLivestockCreated: () => void;
}

const LivestockForm: React.FC<LivestockFormProps> = ({ onLivestockCreated }) => {
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
        <div>
            <h2>Add Livestock</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <label>
                    Species:
                    <input type="text" value={species} onChange={(e) => setSpecies(e.target.value)} required />
                </label>
                <label>
                    Breed:
                    <input type="text" value={breed} onChange={(e) => setBreed(e.target.value)} />
                </label>
                <label>
                    Date of Birth:
                    <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                </label>
                <label>
                    Gender:
                    <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
                </label>
                <label>
                    Health Status:
                    <input type="text" value={healthStatus} onChange={(e) => setHealthStatus(e.target.value)} />
                </label>
                <label>
                    Medication:
                    <input type="text" value={medication} onChange={(e) => setMedication(e.target.value)} />
                </label>
                <label>
                    Vaccination:
                    <input type="text" value={vaccination} onChange={(e) => setVaccination(e.target.value)} />
                </label>
                <button type="submit">Add</button>
            </form>
        </div>
    );
};

export default LivestockForm;
