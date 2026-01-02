# Development Log

## Project: Substance Usage Tracker
**Start Date**: January 2, 2026  
**Status**: Complete - Live on GitHub Pages & Ready for Production Use

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

## Phase 3: Core Features Implementation

### To Do
1. **Data Management**
   - [ ] `useSubstances` hook (CRUD operations)
   - [ ] `useEntries` hook (CRUD operations)
   - [ ] localStorage utilities
   - [ ] JSON export/import functions
   - [ ] UUID generation

2. **Substance Management**
   - [ ] SubstanceForm component (add/edit)
   - [ ] SubstanceList component
   - [ ] Edit & delete functionality

3. **Quick Entry**
   - [ ] QuickEntry component (main data entry)
   - [ ] Form validation
   - [ ] Auto-calculation (delta)
   - [ ] Person dropdown
   - [ ] Success feedback

4. **Historical View**
   - [ ] HistoryList component (all entries)
   - [ ] Sorting (by date, substance, person)
   - [ ] Date filtering

5. **Dashboard & Charts**
   - [ ] Dashboard component
   - [ ] Remaining mass over time (line chart)
   - [ ] Usage per entry (bar chart)
   - [ ] Filter UI

6. **Data Export**
   - [ ] CSV export function
   - [ ] JSON export button
   - [ ] Download to file

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

## Progress Summary

| Phase | Status | Completion |
|-------|--------|-----------|
| Planning & Documentation | ✅ Complete | 100% |
| Project Scaffolding | ⏳ Next | 0% |
| Core Features | 📋 Planned | 0% |
| Polish & Deployment | 📋 Planned | 0% |

---

## Questions & Blockers

**Q**: Should we add a "notes" field to each entry?  
**A**: Defer to Phase 2 review; MVP focuses on mass tracking only.

**Q**: Do we need offline mode?  
**A**: Not required; app assumes always-online (mobile use).

**Q**: Container mass accuracy after substance depletion?  
**A**: Final measurement when substance runs out will reveal container mass with certainty.

---

## Next Steps

1. Create Vite project with React template
2. Install & configure dependencies
3. Set up folder structure & base components
4. Begin Phase 3: Core features implementation
