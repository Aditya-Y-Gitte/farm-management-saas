import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../components/ui/Card';
import { AddHealthRecordForm } from '../components/AddHealthRecordForm';
import '../../../theme/PageCommon.css';

const GlobalAddHealthRecordPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation(['health']);

    const handleSuccess = () => {
        // Return to dashboard after successful global creation
        navigate('/dashboard');
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

    return (
        <div className="page">
            <div className="page__header">
                <div>
                    <h1>{t('health:timeline.addRecord', { defaultValue: 'Add Health Record' })}</h1>
                </div>
            </div>

            <Card style={{ maxWidth: '600px', margin: '0 auto', marginTop: 'var(--space-md)' }}>
                <Card.Body>
                    <AddHealthRecordForm 
                        onSuccess={handleSuccess} 
                        onCancel={handleCancel} 
                    />
                </Card.Body>
            </Card>
        </div>
    );
};

export default GlobalAddHealthRecordPage;
