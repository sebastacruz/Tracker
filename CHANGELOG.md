# Changelog

All notable changes to the Substance Usage Tracker project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Multi-user authentication system
- Cloud sync across devices
- Mobile native app (iOS/Android)
- Advanced analytics and predictions
- Customizable themes
- Component-level tests for UI coverage

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
