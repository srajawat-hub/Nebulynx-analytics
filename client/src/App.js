import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import Prices from './pages/Prices';
import Notifications from './pages/Notifications';
import CreateAlert from './pages/CreateAlert';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="container" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/alerts/create" element={<CreateAlert />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 