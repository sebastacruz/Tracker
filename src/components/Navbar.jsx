/**
 * Navbar component - Minimal header with settings access
 * Logo on left, settings gear on right
 */
import PropTypes from 'prop-types';

export default function Navbar({ currentView, onViewChange, onSettingsToggle }) {
  const isSettings = currentView === 'settings';

  return (
    <nav className="bg-secondary border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <button
            onClick={() => onViewChange('entry')}
            className="hover:opacity-80 focus:opacity-80 focus-visible:ring-2 focus-visible:ring-emerald-400/40 focus-visible:outline-none rounded transition-all cursor-pointer"
            aria-label="Go to Quick Entry"
          >
            <h1 className="text-xl font-semibold text-primary tracking-tight">Dabta</h1>
          </button>

          {/* Settings Button */}
          <button
            onClick={onSettingsToggle}
            className={`p-2.5 rounded-xl transition-colors duration-200 ${
              isSettings
                ? 'bg-emerald-700/20 text-emerald-400'
                : 'text-secondary hover:text-primary hover:bg-tertiary'
            }`}
            aria-label={isSettings ? 'Close settings' : 'Open settings'}
          >
            {isSettings ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  currentView: PropTypes.string.isRequired,
  onViewChange: PropTypes.func.isRequired,
  onSettingsToggle: PropTypes.func.isRequired,
};
