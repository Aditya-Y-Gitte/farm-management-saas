import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DairyList from '../components/DairyList';
import '../../../theme/PageCommon.css';

const DairyPage: React.FC = () => {
  const { t } = useTranslation(['common', 'navigation', 'dashboard', 'animals', 'milk', 'health', 'breeding', 'finance']);
  const navigate = useNavigate();
  const [refreshKey] = useState(false);

  return (
    <div className="page">
      <div className="page__header">
        <h1>🥛 {t('milk:title')}</h1>
        <button className="page__action-btn" onClick={() => navigate('/dairy/record')}>
          {`+ ${t('milk:addLog')}`}
        </button>
      </div>

      <DairyList refresh={refreshKey} />
    </div>
  );
};

export default DairyPage;
