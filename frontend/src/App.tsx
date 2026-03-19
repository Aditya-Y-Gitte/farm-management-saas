import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { Livestock } from './types/livestock';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7030';

function App() {
  const [livestock, setLivestock] = useState<Livestock[]>([]);

  useEffect(() => {
    // For development, the proxy in package.json will be used.
    // For production, REACT_APP_API_URL will be set in Netlify.
    axios.get(`${API_URL}/api/Livestock`)
      .then(response => {
        setLivestock(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the livestock data!', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Livestock</h1>
        <ul>
          {livestock.map(animal => (
            <li key={animal.id}>{animal.name} - {animal.species}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
