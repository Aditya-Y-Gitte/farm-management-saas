import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import LivestockList from '../components/LivestockList';
import LivestockForm from '../components/LivestockForm';
import '../../../theme/PageCommon.css';

const LivestockPage: React.FC = () => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(false);

  const handleCreated = useCallback(() => {
    setRefreshKey(prev => !prev);
    setShowForm(false);
  }, []);

  return (
    <div className="page">
      <div className="page__header">
        <h1>🐄 {t('Livestock Management')}</h1>
        <button className="page__action-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? t('Cancel') : `+ ${t('Add Livestock')}`}
        </button>
      </div>

      {showForm && (
        <div className="page__form-panel">
          <LivestockForm onLivestockCreated={handleCreated} />
        </div>
      )}

      <LivestockList refresh={refreshKey} />
    </div>
  );
};

export default LivestockPage;
