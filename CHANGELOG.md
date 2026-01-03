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
