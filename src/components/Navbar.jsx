/**
 * Navbar component - Navigation and branding
 */
import { useState } from 'react';

export default function Navbar({ currentView, onViewChange, substances }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: 'entry', label: 'Quick Entry', icon: '📝' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'history', label: 'History', icon: '📋' },
    { id: 'substances', label: 'Substances', icon: '⚗️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleNavClick = (viewId) => {
    onViewChange(viewId);
    setMenuOpen(false);
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚖️</span>
            <div>
              <h1 className="text-xl font-bold text-slate-50">Substance Tracker</h1>
              <p className="text-xs text-slate-400">Track usage & trends</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-300"
          >
            <span className="text-2xl">☰</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-2 border-t border-slate-800 pt-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
