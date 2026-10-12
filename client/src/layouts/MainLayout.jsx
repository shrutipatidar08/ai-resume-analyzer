import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { StatusBanner } from '../components/StatusBanner';
import { checkHealth } from '../services/api';

export const MainLayout = () => {
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await checkHealth();
        setHealthStatus(data);
      } catch (err) {
        // Fallback status if server unreachable
        setHealthStatus({
          status: 'connecting',
          database: { connected: false },
          aiEngine: { available: false, mode: 'Rule-Based Engine' },
        });
      }
    };
    fetchHealth();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <StatusBanner healthStatus={healthStatus} />
      <Navbar healthStatus={healthStatus} />
      <main className="flex-1">
        <Outlet context={{ healthStatus }} />
      </main>
      <Footer />
    </div>
  );
};
