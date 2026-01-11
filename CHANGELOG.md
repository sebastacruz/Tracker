# Changelog

All notable changes to the Substance Usage Tracker project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **Flavor Lifecycle Management (2026-01-10)**: Complete flavor deactivation system
  - "Finish Flavor" button in SubstanceManager for manual closeout
  - Active/Inactive filtering tabs to organize flavors by status
  - "Reactivate" button to bring back finished flavors
  - Inactive flavors hidden from QuickEntry dropdown
  - Full history and analytics preserved for inactive flavors
  - Supports overconsumption tracking until final closeout
- **Personal Stats Dashboard (2026-01-08)**: Complete redesign focused on user "t" analytics
  - Overall Summary Card: Mass/day, sessions/day, total tracking days
  - Weekly Comparison: Current week vs previous week with percentage changes
  - Per-Flavor Breakdown Table: Total usage, sessions, and daily rates per flavor
  - Mass Distribution Pie Charts: Visual breakdown per flavor with enhanced mobile labels
  - Consumption Timeline: Line chart filtered to show only user "t" data
  - Six new calculation functions for comprehensive personal analytics
  - Auto-recalculation on data changes with useMemo optimization
  - All metrics focus exclusively on user "t" for personalized insights
- **UI Simplification (2026-01-08)**: Streamlined interface with button-based interactions
  - Replaced all dropdown menus with button grids (2-column layout)
  - QuickEntry: Flavor and person selection now use button grids with emerald highlighting
  - Dashboard: Multi-select flavor buttons with "Select All" and "Clear All" controls
  - Settings page added as 5th swipeable page (linear navigation flow)
  - Removed "Dabta" title and settings gear icon from navbar
  - Dashboard simplified: Removed "Usage by Person" and "All Flavors Overview" charts
  - Only "Remaining Over Time" chart remains for cleaner analytics view
  - Removed "(tap to record)" text from dab size label
  - All changes maintain dark theme and mobile-first design
  - E2E test suite created with Playwright (13 tests, 7 passing core functionality)
- **Pull-to-Refresh**: Mobile-native gesture to refresh data
  - Added to History and Dashboard views
  - Visual feedback with animated spinner
  - Smooth pull-down gesture with resistance
  - Automatic reload when threshold reached (80px)
- **Confirmation Dialog**: Safety check before recording dabs
  - Shows person name and dab size before recording
  - Prevents accidental data entry
  - Clean modal UI with backdrop blur
  - Confirm/Cancel actions with clear buttons

### Changed
- **View Persistence (2026-01-10)**: Current page now persists across refreshes
  - localStorage saves active view when navigating
  - Refresh buttons maintain current page instead of resetting to Entry
  - Improves UX when refreshing Dashboard or History
- **Pie Chart Labels (2026-01-10)**: Mobile-optimized label positioning
  - Labels positioned outside pie slices for better legibility
  - Custom renderLabel function with dynamic positioning
  - One pie per row on mobile (390px viewport)
  - Increased chart height (200px) and spacing (gap-8)
  - Larger font (13px) with high contrast (#e2e8f0)
  - Format: "name: percent%" (e.g., "t: 11%")
  - Tested with Playwright iPhone Safari emulation
- **Navigation System**: Settings accessible via swipe (5 pages total: Entry → Dashboard → History → Flavors → Settings)
- **Button Interactions**: Selected buttons show emerald-500 border and emerald-500/20 background
- **Navbar Simplified**: Now just spacing element (maintains layout consistency)

### Removed
- **Day of Week Chart (2026-01-10)**: Removed "Usage by Day of Week" bar chart from Dashboard
  - Simplified analytics view
  - Cleaned up unused BarChart/Bar imports
  - Removed dayOfWeekData useMemo calculation
- Dropdown menus throughout app (replaced with button grids)
- Settings modal/overlay functionality
- Settings gear icon from navbar
- "Dabta" title from navbar
- Dashboard "Usage by Person" chart
- Dashboard "All Flavors Overview" chart
- "(tap to record)" helper text

### Planned
- Multi-user authentication system
- Cloud sync across devices
- Mobile native app (iOS/Android)
- Advanced analytics and predictions
- Customizable dab size presets
- Undo/redo for entry deletions
- Haptic feedback for iOS devices
- Chart export as PNG/SVG
- Keyboard shortcuts for power users

---

## [1.2.0] - 2026-01-04

### Added - Dabta Redesign

**Branding & Typography**
- **Rebranded to "Dabta"**: New app name replacing "Tracker"
  - Updated navbar title with clickable home button
  - Removed scale emoji for cleaner aesthetic
  - Favicon and meta tags updated for branding
- **Manrope Typography**: Professional Google Font across entire app
  - Weights: 400 (regular), 600 (semibold), 700 (bold)
  - Improved readability and modern aesthetic
  - Consistent tracking and sizing hierarchy

**User Experience Enhancements**
- **One-Tap Dab Recording**: Revolutionary quick-entry UX
  - Preset dab sizes: Small (0.03g), Regular (0.04g), Large (0.05g)
  - Auto-submit on button tap (no manual mass entry needed)
  - Validation: Buttons disabled until flavor + person selected
  - Success feedback with delta display
  - Notes field remains optional
- **Swipe Navigation**: Native iOS-style page swiping
  - Four pages: Entry → Dashboard → History → Flavors
  - Page indicator dots with active state (emerald-500)
  - Smooth scroll-snap alignment
  - iOS momentum scrolling support
- **"Flavors" Terminology**: User-friendly language update
  - "Substances" → "Flavors" across all UI text
  - Table headers, form labels, buttons, messages updated
  - Internal code maintains semantic "substance" for clarity

**Visual Design**
- **Earth-Green Design System**: Cohesive color palette
  - Primary accent: #2E6F40 (earth green)
  - Hover state: #358D47 (lighter green)
  - Active state: #1F4A2A (darker green)
  - Muted accent: rgba(46, 111, 64, 0.5)
  - OLED-optimized dark backgrounds (#0F0F0F, #1A1A1A, #242424)
- **Enhanced Button Interactions**:
  - Micro-interactions: `active:scale-95` transform on dab size buttons
  - Hover states with emerald-700/20 background
  - Focus rings with emerald-400/40 shadow
  - Consistent 3.5px vertical padding for touch targets
- **Dashboard Improvements**:
  - Button-based flavor selector (replaced dropdown)
  - Multi-select with checkboxes for flavor comparison
  - Alphabetical sorting of flavors
  - Chart title updated: "All Flavors Overview"

**Accessibility**
- **ARIA Labels**: Added to all interactive elements
  - Dab size buttons: "Record small dab of 0.03 grams"
  - Page indicators: "Go to Entry page"
  - Navbar: "Go to Quick Entry"
- **Live Regions**: Screen reader announcements
  - `role="alert" aria-live="polite"` for validation messages
  - Dynamic feedback when flavor/person not selected
- **Focus Management**: Enhanced keyboard navigation
  - Visible focus states with emerald ring
  - Focus-visible pseudo-class support
  - Improved tab order across forms

**Mobile Optimization**
- **Touch Target Validation**: All buttons meet iOS guidelines
  - Dab size buttons: 112×76px (exceeds 44px minimum)
  - Input fields: 56px+ height
  - Dropdown items: 48px+ touch targets
- **iPhone 14 Pro Specific**:
  - Viewport: 393×852 tested
  - Safe area padding for notch: `pb-safe` utility
  - No horizontal scroll (verified)
  - Charts render within viewport bounds

### Changed

**Component Updates**
- **QuickEntry** ([QuickEntry.jsx:152](src/components/QuickEntry.jsx#L152)):
  - Heading: "Quick Entry" → "Take a dab"
  - Removed subtitle "Record substance usage"
  - Removed "How it works" instructional card
  - Added dab size button grid with validation
  - Added ARIA live region for accessibility
  - Success message: "Entry saved! Delta: Xg"

- **Navbar** ([Navbar.jsx:20](src/components/Navbar.jsx#L20)):
  - Title: "Tracker" → "Dabta"
  - Made clickable with navigation to Quick Entry
  - Enhanced focus states and cursor pointer
  - Removed scale emoji (⚖️)

- **Dashboard** ([Dashboard.jsx:180](src/components/Dashboard.jsx#L180)):
  - Flavor selector: Dropdown → Button-based multi-select
  - Added checkbox selection UI
  - Alphabetical flavor sorting
  - Chart title: "All Substances Overview" → "All Flavors Overview"
  - Improved dropdown styling with shadow-xl

- **SubstanceManager** ([SubstanceManager.jsx:56](src/components/SubstanceManager.jsx#L56)):
  - Page heading: "Substances" → "Flavors"
  - Removed subtitle "Manage tracked substances"
  - Button: "+ Add New Substance" → "+ Add New Flavor"
  - Form title: "Add New Substance" → "Add New Flavor"
  - Error/success messages updated to "flavor" terminology
  - Empty state: "No substances yet" → "No flavors yet"

- **History** ([History.jsx:95](src/components/History.jsx#L95)):
  - Table header: "Substance" → "Flavor"
  - Filter label: "Filter by Substance" → "Filter by Flavor"
  - Dropdown options updated

**Style System** ([globals.css](src/styles/globals.css)):
- Added Manrope font import from Google Fonts
- Updated CSS custom properties for earth-green theme
- Enhanced button classes with micro-interactions
- Added transition-transform utilities
- Improved focus ring styles

### Fixed
- Validation messaging clarity (amber warnings before dab size buttons)
- Dropdown positioning with proper z-index (z-50)
- Mobile menu scrolling on flavor selectors
- React key prop warnings in console

### Performance
- **Mobile Validation**: iPhone 14 Pro (393×852)
  - Touch targets: 112×76px (verified)
  - No layout shifts during interaction
  - Smooth 60fps swipe navigation
  - Charts render within viewport
- **Regression Testing**: 100% pass rate
  - All 8 redesign requirements verified
  - Data integrity maintained
  - localStorage structure intact
  - No console errors in production

### Documentation
- Updated README.md with v1.2.0 features
- Added comprehensive redesign documentation
- Updated component references with line numbers
- Enhanced accessibility documentation

### UI/UX Review Score: 9.6/10
- Visual Design: 9.5/10
- User Experience: 9.5/10
- Component Consistency: 10/10
- Mobile Experience: 10/10
- Accessibility: 8.5/10
- Terminology & Messaging: 10/10

**Status**: ✅ APPROVED FOR PRODUCTION

---

## [1.1.0] - 2026-01-03

### Added - Testing Infrastructure
- **Comprehensive Test Suite**: 104 total tests (61 unit + 27 integration + 16 performance)
  - Unit tests for calculations.js (61 tests, 100% coverage)
  - Integration tests for custom hooks (27 tests, 100% function coverage)
  - Performance tests for scalability validation (16 tests)
- **Vitest Configuration**: Modern test framework with coverage reporting
- **Test Utilities**: Setup file with mocks for localStorage, window.confirm, URL APIs
- **Performance Baseline**: Large dataset fixture (200 entries, 20 substances) for testing

### Added - CI/CD & Quality Gates
- **GitHub Actions CI Pipeline**: Automated testing on every PR and push
  - Runs linting, tests, and build verification
  - Blocks merge if any step fails
- **Pre-commit Hooks**: Husky + lint-staged integration
  - Auto-formats code with Prettier
  - Runs ESLint with auto-fix
  - Prevents bad commits from entering repository
- **Bundle Size Monitoring**: Rollup plugin visualizer tracking bundle growth
  - Generates visual analysis report (docs/bundle-analysis.html)
  - Tracks Gzip and Brotli compression sizes

### Added - Error Handling & Validation
- **Error Boundary Component**: Graceful error handling for React crashes
  - User-friendly fallback UI with recovery options
  - Debug info toggle for development
  - "Try Again", "Go Home", and "Clear Data" recovery buttons
- **Enhanced Input Validation**: Improved data entry safety
  - Prevents negative mass values with real-time feedback
  - XSS prevention with input sanitization
  - Visual validation feedback (red borders, warning icons)
  - Submit button disabled until form is valid

### Added - Documentation
- **Security Review Report**: Comprehensive security analysis (docs/security-review.md)
  - Dependency vulnerability audit
  - XSS pattern analysis across all components
  - localStorage security validation
  - OWASP Top 10 compliance mapping
- **Code Quality Report**: Detailed quality metrics (docs/code-quality-review.md)
  - Cyclomatic complexity analysis (71+ functions analyzed)
  - Component size analysis
  - ESLint violation categorization
  - Refactoring priorities and baseline metrics
- **Performance Baseline Report**: Scalability validation (docs/performance-baseline.md)
  - Performance metrics with 20 substances and 200+ entries
  - Mobile performance testing results
  - Bottleneck analysis and optimization recommendations

### Changed
- **QuickEntry Component**: Enhanced with real-time validation feedback
- **Test Scripts**: Added `test`, `test:ui`, and `test:coverage` npm scripts
- **Development Workflow**: Pre-commit hooks enforce code quality standards

### Security
- **Zero High/Critical Vulnerabilities**: Comprehensive security review completed
- **XSS Prevention**: Input sanitization implemented across data entry points
- **Dependency Audit**: All packages up-to-date, 2 moderate issues patched

### Performance
- **Exceptional Scalability**: All operations 100-1000x faster than targets
  - Load 20 substances: 0.12ms
  - Filter 200 entries: 0.10ms
  - Sort 200 entries: 0.45ms
  - Aggregate statistics: 0.23ms
- **Storage Efficiency**: 31.79 KB for large dataset (3.2% of 1MB limit)
- **Mobile Optimized**: Smooth rendering with no UI jank

### Developer Experience
- **Test Coverage**: 100% on critical paths (calculations + hooks)
- **Fast Tests**: Full test suite runs in <1 second
- **Automated Quality**: CI/CD prevents regressions
- **Code Quality**: A grade (85/100) with minimal technical debt

---

## [1.0.0] - 2026-01-03

### Added
- **Usage Analytics**: Dashboard charts showing consumption trends
- **Optional Notes Field**: Add notes to individual entries
- **Multi-Flavor Dashboard**: Select multiple substances for comparison
- **Historical Seed Data**: Pre-loaded sample data (9 entries from Jan 1-2, 2026)
- **Export Functionality**: CSV and JSON export for external analysis
- **Substance Management**: Add, edit, and delete substances with theoretical mass
- **Quick Entry Interface**: Primary data entry screen for rapid logging
- **Dark Theme**: Battery-efficient dark mode optimized for mobile
- **iCloud Integration**: Manual export/import via JSON files
- **Responsive Design**: Mobile-first UI optimized for iPhone Safari
- **Real-time Calculations**: Auto-calculate delta (mass consumed)
- **Progress Tracking**: Visual progress bars for remaining substance mass

### Changed
- **Container Mass Handling**: Theoretical initial mass set to 1g (substance only, excluding container)
- **Branding**: Updated to "Dab Tracker" with flavor-based labels
- **Build Output**: Configured to `docs/` folder for GitHub Pages deployment

### Fixed
- **Mobile Safari Dropdowns**: Fixed dropdown menu behavior on iOS
- **Container Mass Calculation**: Improved accuracy for remaining mass calculations
- **Seed Data Migration**: Removed migration function, rely on seed data for 1g default mass

---

## [0.1.0] - 2026-01-02

### Added
- Initial project setup with Vite + React 18
- Tailwind CSS configuration with dark theme
- Basic component structure (App, Navbar, QuickEntry, Dashboard, History, Settings)
- localStorage-based data persistence
- Custom React hooks (useSubstances, useEntries)
- Utility functions (calculations, storage, seedData)
- Recharts integration for data visualization
- ESLint and Prettier configuration
- Git repository initialization
- GitHub Pages deployment setup

### Documentation
- Created README.md with quick start guide
- Created DEVLOG.md for development history
- Created ARCHITECTURE.md with system design diagrams
- Created PLAN.md with feature specifications

---

## Version History Summary

| Version | Date | Description |
|---------|------|-------------|
| 1.2.0 | 2026-01-04 | Dabta redesign: One-tap dab recording, swipe navigation, earth-green theme |
| 1.1.0 | 2026-01-03 | Testing infrastructure, CI/CD, and quality gates |
| 1.0.0 | 2026-01-03 | First production release with full features |
| 0.1.0 | 2026-01-02 | Initial project setup and scaffolding |

---

## Links

- **Live App**: https://sebastacruz.github.io/Tracker/
- **Repository**: https://github.com/sebastacruz/Tracker
- **Issues**: https://github.com/sebastacruz/Tracker/issues

---

## Notes

This project uses a single-file localStorage strategy with manual export/import for backup and sync. All data remains private on the user's device. For detailed technical architecture, see [ARCHITECTURE.md](ARCHITECTURE.md).
