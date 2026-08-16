import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import FeedList from '../components/FeedList';

const FeedPage: React.FC = () => {
    const { t } = useTranslation(['feed']);
    const navigate = useNavigate();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                <h2>{t('feed:title')}</h2>
                <Button variant="primary" onClick={() => navigate('/feed/add')}>
                    + {t('feed:addFeed')}
                </Button>
            </div>
            
            <h4 style={{ marginBottom: 'var(--space-md)' }}>{t('feed:history')}</h4>
            <FeedList />
        </div>
    );
};

export default FeedPage;
