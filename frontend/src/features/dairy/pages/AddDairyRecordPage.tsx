import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DairyRecordForm from '../components/DairyRecordForm';
import { Button } from '../../../components/ui/Button';

const AddDairyRecordPage: React.FC = () => {
    const { t } = useTranslation(['milk', 'common']);
    const navigate = useNavigate();

    const handleSaved = () => {
        navigate('/dairy');
    };

    return (
        <div className="page">
            <div className="page__header" style={{ marginBottom: 'var(--space-lg)' }}>
                <div>
                    <h1>{t('milk:record.title', { defaultValue: 'Record Milk' })}</h1>
                    <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                        {t('milk:record.subtitle', { defaultValue: 'Enter daily milk production details' })}
                    </p>
                </div>
                <Button variant="secondary" onClick={() => navigate('/dairy')}>
                    &larr; {t('common:actions.cancel', { defaultValue: 'Cancel' })}
                </Button>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <DairyRecordForm onSaved={handleSaved} />
            </div>
        </div>
    );
};

export default AddDairyRecordPage;
