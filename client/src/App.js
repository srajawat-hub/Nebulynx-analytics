import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import Prices from './pages/Prices';
import Notifications from './pages/Notifications';
import CreateAlert from './pages/CreateAlert';
import Asset from './pages/Asset';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/alerts/create" element={<CreateAlert />} />
        <Route path="/prices" element={<Prices />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/asset/:symbol" element={<Asset />} />
      </Routes>
    </div>
  );
}

export default App; 