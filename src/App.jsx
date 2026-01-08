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
import { useEntries } from './hooks/useEntries';

export default function App() {
  const { substances } = useSubstances();
  const { entries } = useEntries();
  const [currentView, setCurrentView] = useState('entry');

  return (
    <div className="min-h-screen bg-primary text-primary flex flex-col">
      <Navbar />

      <SwipeContainer currentView={currentView} onViewChange={setCurrentView}>
        {/* Page 1: Quick Entry */}
        <div
          data-page="entry"
          className="swipe-page flex-shrink-0 w-full min-h-[calc(100vh-4rem)] snap-center"
        >
          <QuickEntry substances={substances} entries={entries} />
        </div>

        {/* Page 2: Dashboard */}
        <div
          data-page="dashboard"
          className="swipe-page flex-shrink-0 w-full min-h-[calc(100vh-4rem)] snap-center"
        >
          <Dashboard substances={substances} entries={entries} />
        </div>

        {/* Page 3: History */}
        <div
          data-page="history"
          className="swipe-page flex-shrink-0 w-full min-h-[calc(100vh-4rem)] snap-center"
        >
          <History substances={substances} entries={entries} />
        </div>

        {/* Page 4: Substance Manager (Flavors) */}
        <div
          data-page="substances"
          className="swipe-page flex-shrink-0 w-full min-h-[calc(100vh-4rem)] snap-center"
        >
          <SubstanceManager />
        </div>

        {/* Page 5: Settings */}
        <div
          data-page="settings"
          className="swipe-page flex-shrink-0 w-full min-h-[calc(100vh-4rem)] snap-center"
        >
          <div className="max-w-2xl mx-auto p-4 md:p-6">
            <Settings substances={substances} entries={entries} />
          </div>
        </div>
      </SwipeContainer>

      <PageIndicator pages={PAGES} currentPage={currentView} onPageSelect={setCurrentView} />
    </div>
  );
}
