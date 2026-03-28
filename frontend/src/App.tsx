import React, { useState, useCallback } from 'react';
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

  const tabs = [
    {
      label: 'Dashboard',
      content: <Dashboard />,
    },
    {
      label: 'Livestock',
      content: (
        <div>
          <button className="tab-content-button" onClick={() => setShowLivestockForm(!showLivestockForm)}>
            {showLivestockForm ? 'Hide Form' : 'Add Livestock'}
          </button>
          {showLivestockForm && <LivestockForm onLivestockCreated={handleLivestockCreate} />}
          <LivestockList refresh={refreshLivestock} />
        </div>
      ),
    },
    {
      label: 'Dairy',
      content: (
        <div>
          <button className="tab-content-button" onClick={() => setShowDairyForm(!showDairyForm)}>
            {showDairyForm ? 'Hide Form' : 'Add Dairy Log'}
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
        <h1>Farm Management SaaS</h1>
      </header>
      <main>
        <HealthCheck />
        <Tabs tabs={tabs} />
      </main>
    </div>
  );
}

export default App;
