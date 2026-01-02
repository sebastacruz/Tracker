/**
 * App.jsx - Main application component
 */
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import QuickEntry from './components/QuickEntry';
import Dashboard from './components/Dashboard';
import History from './components/History';
import SubstanceManager from './components/SubstanceManager';
import Settings from './components/Settings';
import { useSubstances } from './hooks/useSubstances';
import { initializeSeedData } from './utils/seedData';

export default function App() {
  const { substances } = useSubstances();
  const [currentView, setCurrentView] = useState('entry');

  // Initialize seed data on first run
  useEffect(() => {
    initializeSeedData();
  }, []);

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'entry':
        return <QuickEntry substances={substances} />;
      case 'dashboard':
        return <Dashboard substances={substances} />;
      case 'history':
        return <History substances={substances} />;
      case 'substances':
        return <SubstanceManager />;
      case 'settings':
        return <Settings />;
      default:
        return <QuickEntry substances={substances} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar currentView={currentView} onViewChange={setCurrentView} substances={substances} />
      <main className="pb-8">
        {renderView()}
      </main>
    </div>
  );
}
