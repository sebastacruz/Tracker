/**
 * App.jsx - Main application component with swipe navigation
 */
import { useState } from 'react';
import Navbar from './components/Navbar';
import QuickEntry from './components/QuickEntry';
import Dashboard from './components/Dashboard';
import History from './components/History';
import SubstanceManager from './components/SubstanceManager';
import Settings from './components/Settings';
import SwipeContainer, { PAGES } from './components/SwipeContainer';
import PageIndicator from './components/PageIndicator';
import { useSubstances } from './hooks/useSubstances';

export default function App() {
  const { substances } = useSubstances();
  const [currentView, setCurrentView] = useState('entry');
  const [showSettings, setShowSettings] = useState(false);

  // Handle view change from swipe or indicator
  const handleViewChange = (view) => {
    if (view === 'settings') {
      setShowSettings(true);
    } else {
      setShowSettings(false);
      setCurrentView(view);
    }
  };

  // Settings modal/overlay
  if (showSettings) {
    return (
      <div className="min-h-screen bg-primary text-primary">
        <Navbar
          currentView="settings"
          onViewChange={handleViewChange}
          onSettingsToggle={() => setShowSettings(false)}
          showSettingsGear={true}
        />
        <main className="pb-8">
          <Settings />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-primary flex flex-col">
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        onSettingsToggle={() => setShowSettings(true)}
        showSettingsGear={true}
      />

      <SwipeContainer currentView={currentView} onViewChange={setCurrentView}>
        {/* Page 1: Quick Entry */}
        <div
          data-page="entry"
          className="swipe-page flex-shrink-0 w-full min-h-[calc(100vh-4rem)] snap-center"
        >
          <QuickEntry substances={substances} />
        </div>

        {/* Page 2: Dashboard */}
        <div
          data-page="dashboard"
          className="swipe-page flex-shrink-0 w-full min-h-[calc(100vh-4rem)] snap-center"
        >
          <Dashboard substances={substances} />
        </div>

        {/* Page 3: History */}
        <div
          data-page="history"
          className="swipe-page flex-shrink-0 w-full min-h-[calc(100vh-4rem)] snap-center"
        >
          <History substances={substances} />
        </div>

        {/* Page 4: Substance Manager (Flavors) */}
        <div
          data-page="substances"
          className="swipe-page flex-shrink-0 w-full min-h-[calc(100vh-4rem)] snap-center"
        >
          <SubstanceManager />
        </div>
      </SwipeContainer>

      <PageIndicator pages={PAGES} currentPage={currentView} onPageSelect={setCurrentView} />
    </div>
  );
}
