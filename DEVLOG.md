# Development Log

## Project: Substance Usage Tracker
**Start Date**: January 2, 2026
**Current Version**: 1.0.0
**Status**: ✅ Production - Live on GitHub Pages
**Live URL**: https://sebastacruz.github.io/Tracker/

---

## Phase 1: Planning & Documentation

### January 2, 2026

#### Requirements Gathering ✅
- Clarified data strategy: JSON file in iCloud (GitHub Pages hosted app)
- Confirmed features: Quick entry, historical view, charts, CSV export
- Tech stack: React + Vite + Tailwind + Recharts
- Dark theme required
- Mobile-first for iPhone Safari

#### Documentation Created ✅
- **PLAN.md**: Comprehensive project specification
  - Core requirements and features
  - Technical architecture
  - Data schema (JSON structure)
  - Implementation phases
  - User flows

- **README.md**: User-facing documentation
  - Quick start guide
  - Installation instructions
  - Feature overview
  - Deployment steps

- **CODE.md**: Developer guidelines
  - Code conventions
  - Component structure
  - Testing approach
  - Performance notes

#### Architecture Decisions 📋
1. **Vite + React 18**: Fast dev experience, great mobile support
2. **Tailwind CSS**: Rapid styling with dark theme support
3. **Recharts**: Lightweight charting library (no complex dependencies)
4. **localStorage + JSON export**: Simple storage, user owns data
5. **GitHub Pages**: Free hosting, no backend needed
6. **Single tracker.json file**: Simple structure, easy to analyze

---

## Phase 2: Project Scaffolding

### ✅ Completed (January 2, 2026)
- [x] Create Vite project with React template configuration
- [x] Create package.json with all dependencies (Tailwind, Recharts, uuid)
- [x] Set up folder structure (/src/components, /src/hooks, /src/utils, /src/styles)
- [x] Configure Tailwind for dark theme (default dark, no light mode)
- [x] Configure Vite, PostCSS, ESLint, Prettier
- [x] Create base layout with Navbar component

### Project Files Created
- `package.json` - Dependencies and scripts
- `vite.config.js` - Vite configuration with base path for GitHub Pages
- `tailwind.config.js` - Tailwind CSS with dark theme
- `postcss.config.js` - PostCSS configuration
- `.eslintrc.cjs` - ESLint rules
- `.prettierrc` - Prettier formatting
- `index.html` - HTML entry point with meta tags
- `.gitignore` - Git ignore rules

### Notes
- Using `create-vite` with React template
- Will use UUID for substance/entry IDs
- Tailwind dark mode via `dark:` class prefix

---

## Phase 3: Core Features Implementation ✅

### Completed (January 2-3, 2026)

1. **Data Management** ✅
   - [x] `useSubstances` hook (CRUD operations)
   - [x] `useEntries` hook (CRUD operations)
   - [x] localStorage utilities
   - [x] JSON export/import functions
   - [x] UUID generation

2. **Substance Management** ✅
   - [x] SubstanceManager component (add/delete)
   - [x] Substance cards with progress bars
   - [x] Delete functionality with confirmation
   - [x] Active/inactive substance toggling

3. **Quick Entry** ✅
   - [x] QuickEntry component (main data entry)
   - [x] Form validation
   - [x] Auto-calculation (delta)
   - [x] Person dropdown with autocomplete
   - [x] Success feedback
   - [x] Optional notes field

4. **Historical View** ✅
   - [x] History component (all entries)
   - [x] Filtering by substance and person
   - [x] Sort by date (newest first)
   - [x] Entry details display

5. **Dashboard & Charts** ✅
   - [x] Dashboard component
   - [x] Remaining mass over time (line chart)
   - [x] Usage by person (bar chart)
   - [x] Usage by substance (bar chart)
   - [x] Multi-substance selection filter

6. **Data Export** ✅
   - [x] CSV export function
   - [x] JSON export function
   - [x] Browser download functionality
   - [x] Import from JSON

---

## Phase 4: Polish & Deployment ✅

### Completed (January 2, 2026)

#### Environment Setup ✅
- [x] Node.js v20 installed via NVM
- [x] npm dependencies installed (362 packages)
- [x] Development server tested and working
- [x] Hot reload verified

#### Seed Data Added ✅
- [x] Created seedData.js with sample data
- [x] Loaded 2 substances (Apollo, Gramlin)
- [x] Loaded 9 entries from spreadsheet data
- [x] Correct user assignments: t (7), e (2)
- [x] App pre-loads with data on first run
- [x] Updated GitHub repository

#### GitHub Pages Deployment ✅
- [x] Production build created (`npm run build`)
- [x] Output directory configured to `docs/` folder
- [x] `.gitignore` updated to allow docs folder
- [x] Repository pushed to sebastacruz/Tracker
- [x] GitHub Pages configured to use main branch
- [x] Site live at: https://sebastacruz.github.io/Tracker/
- [x] App loads with seed data and dark theme
- [x] All features tested and working

#### Documentation Updated ✅
- [x] README reflects seed data and GitHub URLs
- [x] QUICK_START updated with NVM setup
- [x] All docs reference correct URLs and users
- [x] Installation steps verified

---

## Technical Notes

### localStorage vs iCloud Strategy
- **In-App**: Use localStorage for fast, instant access during use
- **Backup**: User manually exports JSON to iCloud Files folder
- **Analytics**: Read JSON file from Mac using external tools
- **Sync**: Automatic via iCloud, user controls export timing

### Calculation Logic
```
Usage Delta = Initial Mass - Final Mass
Remaining = Theoretical Initial - SUM(all deltas for substance)
```

### Dark Theme Implementation
- Tailwind's built-in dark mode
- Default dark theme (not light)
- Colors: Slate/neutral grays with accent colors

### Component Hierarchy
```
App
├── Navbar
├── Router/Tabs
│   ├── QuickEntry (default screen)
│   ├── Dashboard (charts & trends)
│   ├── SubstanceManager (add/edit substances)
│   └── Settings (export, clear data, etc.)
```

---

## Decisions & Rationale

| Decision | Rationale |
|----------|-----------|
| Vite over Create React App | Faster build times, better dev experience |
| Recharts over Chart.js | Lightweight, React-native, good mobile support |
| Single JSON file | Simple structure, easy to analyze externally |
| GitHub Pages | Free, no backend needed, always accessible |
| localStorage + manual export | User owns data, privacy-first, simple |
| Dark theme default | Mobile battery efficient, eye-friendly for evening use |
| No authentication | Personal use case, all data stays on device |

---

## Known Limitations & Future Improvements

### Current Scope
- Single device use (manual sync across devices)
- No real-time cloud sync
- No authentication
- No offline data merge

### Future Enhancements (Out of Scope)
- [ ] Optional Google Drive sync
- [ ] Real-time collaborative tracking
- [ ] Mobile app (native iOS)
- [ ] Data encryption
- [ ] Machine learning predictions
- [ ] Sharing/collaboration features

---

## Testing Notes

### Manual Testing Checklist
- [ ] Add substance on mobile Safari
- [ ] Quick entry works on touch screen
- [ ] Charts render correctly
- [ ] Export creates valid CSV
- [ ] JSON file can be read on Mac
- [ ] Data persists after refresh
- [ ] Dark theme applied correctly
- [ ] Responsive on iPhone SE, iPhone 13, iPhone 15 sizes

### Browser Compatibility
- Target: Safari 15+ (iOS 15+)
- Modern browsers (Chrome, Firefox, Edge)
- Mobile-first approach

---

## Version 1.0.0 Features Summary

### Completed Features

- ✅ Quick Entry interface for rapid data logging
- ✅ Substance Manager (add, delete, view remaining mass)
- ✅ Dashboard with interactive charts (Recharts)
  - Line chart: Remaining mass over time
  - Bar charts: Usage by person and substance
  - Multi-substance selection filter
- ✅ History view with filtering and sorting
- ✅ Settings view with export/import
  - JSON export for backup
  - CSV export for external analysis
  - Import from JSON
  - Clear all data function
- ✅ Dark theme optimized for mobile battery life
- ✅ localStorage persistence
- ✅ Sample seed data for onboarding
- ✅ Optional notes field for entries
- ✅ Real-time delta calculation
- ✅ Progress bars for substance depletion
- ✅ Responsive design for iPhone Safari

### Progress Summary

| Phase | Status | Completion |
|-------|--------|-----------|
| Planning & Documentation | ✅ Complete | 100% |
| Project Scaffolding | ✅ Complete | 100% |
| Core Features | ✅ Complete | 100% |
| Polish & Deployment | ✅ Complete | 100% |
| **v1.0.0 Production** | ✅ **LIVE** | **100%** |

---

## Implementation Notes & Lessons Learned

### Key Technical Decisions

1. **localStorage Over Cloud Database**
   - Rationale: Privacy-first, no backend costs, instant access
   - Trade-off: Manual sync required, single-device primary storage
   - Solution: Export/import via JSON for backup and multi-device use

2. **Vite Over Create React App**
   - Rationale: Faster build times, better dev experience, smaller bundle
   - Benefit: HMR (Hot Module Replacement) dramatically speeds up development

3. **Recharts Over Chart.js**
   - Rationale: React-native API, smaller bundle, good mobile performance
   - Benefit: Declarative component syntax matches React patterns

4. **Dark Theme Only**
   - Rationale: Mobile battery efficiency, evening use case
   - Implementation: CSS forced dark mode + Tailwind dark theme utilities

5. **Container Mass Strategy**
   - Initial uncertainty about container tare weight
   - Solution: Set theoretical initial mass to 1g (substance only)
   - When depleted, final measurement reveals actual container mass

### Challenges Overcome

1. **Mobile Safari Dropdown Issues**
   - Problem: Native select dropdowns behaving inconsistently on iOS
   - Solution: Styled native select elements with proper touch targets

2. **Chart Data Computation Performance**
   - Problem: Re-calculating chart data on every render
   - Solution: useMemo hooks for derived chart data

3. **Seed Data Integration**
   - Problem: How to provide sample data without forcing migrations
   - Solution: seedData.js with conditional initialization on first load

4. **GitHub Pages Base Path**
   - Problem: Assets not loading on GitHub Pages subdirectory
   - Solution: Vite config `base: '/Tracker/'` for proper URL resolution

### Future Improvement Ideas (Out of Current Scope)

- [ ] PWA offline support with service workers
- [ ] Real-time cloud sync (Firebase/Supabase)
- [ ] Multi-user authentication
- [ ] Advanced analytics (ML predictions for depletion dates)
- [ ] Native mobile app (React Native)
- [ ] Dark/light theme toggle
- [ ] Undo/redo functionality
- [ ] Bulk data operations (delete multiple entries)

---

## Questions Resolved

**Q**: Should we add a "notes" field to each entry?
**A**: ✅ **Implemented in v1.0.0** - Added optional notes field

**Q**: Do we need offline mode?
**A**: Not for v1.0.0; localStorage works offline by default, manual sync acceptable

**Q**: Container mass accuracy after substance depletion?
**A**: ✅ **Resolved** - Theoretical initial mass set to 1g (substance only); final measurement reveals container mass

---

## Project Timeline

| Date | Milestone |
|------|-----------|
| 2026-01-02 | Project inception, planning, and scaffolding |
| 2026-01-02 | Core features implemented (Quick Entry, Dashboard, History) |
| 2026-01-02 | GitHub Pages deployment successful |
| 2026-01-03 | v1.0.0 release with usage analytics and notes feature |
| 2026-01-03 | Documentation cleanup and project initialization |
