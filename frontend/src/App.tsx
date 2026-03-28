import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';
import LivestockList from './components/livestock/LivestockList';
import LivestockForm from './components/livestock/LivestockForm';
import DairyList from './components/dairy/DairyList';
import DairyForm from './components/dairy/DairyForm';
import HealthCheck from './components/HealthCheck';
import Tabs from './components/Tabs';
import Dashboard from './components/Dashboard';
import './components/Tabs.css';

function App() {
  const { t, i18n } = useTranslation();
  const [showLivestockForm, setShowLivestockForm] = useState(false);
  const [showDairyForm, setShowDairyForm] = useState(false);
  const [refreshLivestock, setRefreshLivestock] = useState(false);
  const [refreshDairy, setRefreshDairy] = useState(false);

  const handleLivestockCreate = useCallback(() => {
    setRefreshLivestock(prev => !prev);
    setShowLivestockForm(false);
  }, []);

  const handleDairyCreate = useCallback(() => {
    setRefreshDairy(prev => !prev);
    setShowDairyForm(false);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const tabs = [
    {
      label: t('Dashboard'),
      content: <Dashboard />,
    },
    {
      label: t('Livestock'),
      content: (
        <div>
          <button className="tab-content-button" onClick={() => setShowLivestockForm(!showLivestockForm)}>
            {showLivestockForm ? t('Hide Form') : t('Add Livestock')}
          </button>
          {showLivestockForm && <LivestockForm onLivestockCreated={handleLivestockCreate} />}
          <LivestockList refresh={refreshLivestock} />
        </div>
      ),
    },
    {
      label: t('Dairy'),
      content: (
        <div>
          <button className="tab-content-button" onClick={() => setShowDairyForm(!showDairyForm)}>
            {showDairyForm ? t('Hide Form') : t('Add Dairy Log')}
          </button>
          {showDairyForm && <DairyForm onDairyCreated={handleDairyCreate} />}
          <DairyList refresh={refreshDairy} />
        </div>
      ),
    },
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>{t('Farm Management SaaS')}</h1>
        <div className="language-switcher">
          <button onClick={() => changeLanguage('en')}>English</button>
          <button onClick={() => changeLanguage('mr')}>मराठी</button>
        </div>
      </header>
      <main>
        <HealthCheck />
        <Tabs tabs={tabs} />
      </main>
    </div>
  );
}

export default App;
