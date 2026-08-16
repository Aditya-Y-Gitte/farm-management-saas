import React from 'react';
import { useTranslation } from 'react-i18next';
import FeedForm from '../components/FeedForm';

const FeedAddPage: React.FC = () => {
    const { t } = useTranslation(['feed']);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: 'var(--space-md)' }}>{t('feed:addFeed')}</h2>
            <FeedForm />
        </div>
    );
};

export default FeedAddPage;
