import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getLivestocks } from '../../../services/livestockService';
import { Livestock } from '../../../types/livestock';

export interface AnimalSelectorProps {
  value: string;
  onChange: (livestockId: string) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

export const AnimalSelector: React.FC<AnimalSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  error,
  required = false
}) => {
  const { t } = useTranslation(['animals', 'common']);
  const [animals, setAnimals] = useState<Livestock[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If disabled and we have a value, we don't necessarily need to fetch the whole list
    // However, for the contextual view, we might just display the animal's ID or name
    // But since this is a select box, we can just render the selected option directly 
    // if disabled, or load the list. 
    // For now, load a bounded list until backend supports searchable endpoints natively.
    let isMounted = true;
    
    const fetchAnimals = async () => {
      setLoading(true);
      try {
        // Temporarily fetching a bounded list (100) until a searchable endpoint is built
        const response = await getLivestocks(1, 100);
        if (isMounted) {
          setAnimals(response.items);
        }
      } catch (err) {
        console.error('Failed to load animals for selector', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAnimals();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="input-group">
      <label className="input-label">
        {t('health:form.selectAnimal', { defaultValue: 'Select Animal' })}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <select
        className={`input-field ${error ? 'input-error' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        required={required}
      >
        <option value="" disabled>
          {loading ? t('common:loading', { defaultValue: 'Loading...' }) : t('health:form.selectAnimal', { defaultValue: 'Select Animal' })}
        </option>
        
        {/* If disabled and we have a value but it's not in the loaded list, ensure it's still displayed */}
        {disabled && value && !animals.find(a => a.id === value) && (
          <option value={value}>{value}</option>
        )}

        {animals.map((animal) => (
          <option key={animal.id} value={animal.id}>
            [{animal.tagNumber}] {animal.name}
          </option>
        ))}
      </select>
      
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};
