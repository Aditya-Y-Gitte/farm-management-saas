import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LivestockList from '../components/LivestockList';
import '../../../theme/PageCommon.css';

const LivestockPage: React.FC = () => {
  const { t } = useTranslation(['animals']);
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="page__header">
        <h1>🐄 {t('animals:title', { defaultValue: 'Livestock Management' })}</h1>
        <button className="page__action-btn" onClick={() => navigate('/livestock/add')}>
          + {t('animals:add', { defaultValue: 'Add Livestock' })}
        </button>
      </div>

      <LivestockList />
    </div>
  );
};

export default LivestockPage;
