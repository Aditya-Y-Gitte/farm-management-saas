import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DairyList from '../components/DairyList';
import DairyForm from '../components/DairyForm';
import '../../../theme/PageCommon.css';

const DairyPage: React.FC = () => {
  const { t } = useTranslation(['common', 'navigation', 'dashboard', 'animals', 'milk', 'health', 'breeding', 'finance']);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(false);

  const handleCreated = useCallback(() => {
    setRefreshKey(prev => !prev);
    setShowForm(false);
  }, []);

  return (
    <div className="page">
      <div className="page__header">
        <h1>🥛 {t('milk:title')}</h1>
        <button className="page__action-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? t('common:actions.cancel') : `+ ${t('milk:addLog')}`}
        </button>
      </div>

      {showForm && (
        <div className="page__form-panel">
          <DairyForm onDairyCreated={handleCreated} />
        </div>
      )}

      <DairyList refresh={refreshKey} />
    </div>
  );
};

export default DairyPage;
