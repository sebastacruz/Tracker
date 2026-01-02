# Substance Usage Tracker - Project Plan

## Overview
A mobile-first web application for tracking substance consumption through mass measurements. Built for iPhone Safari with local JSON data storage synced via iCloud.

---

## Core Requirements

### Data Management
- **Storage**: JSON file(s) in iCloud-synced folder (user accesses from MacBook for analysis)
- **Format**: Single `tracker.json` file containing all substances and entries
- **Sync**: Automatic via iCloud; user can side-develop analytics with the JSON

### Substances
- **Tracking**: Multiple substances (Apollo, Gramlin, etc.)
- **Theoretical Initial Mass**: User-defined value per substance
- **Remaining Calculation**: `Theoretical Initial - sum(all usage deltas for that substance)`
- **Container Mass**: Determined indirectly; becomes certain when substance runs out

### Usage Entries
- **Input**: Initial mass → Final mass
- **Auto-calculation**: Delta = Initial - Final (mass consumed)
- **Person Tracking**: Record who used the substance
- **Timestamp**: Auto-recorded for each entry

### Features

#### 1. Substance Management
- Add new substance with name and theoretical initial mass
- Edit substance parameters
- View all active substances
- Delete substance (archive entries)

#### 2. Quick Entry Screen
- Select substance from dropdown
- Select person from dropdown
- Input Initial Mass (grams)
- Input Final Mass (grams)
- Auto-calculates delta
- One-tap save
- Optimized for mobile/iPhone

#### 3. Historical Data View
- **List View**: All entries sorted by date (newest first)
- **Visual Dashboard**: Line/bar charts showing:
  - Remaining mass over time (per substance)
  - Usage delta per entry
  - Usage trends per person
  - Cumulative usage per substance
- **Filters**: By date range, substance, person
- **Export**: CSV export for external analytics

#### 4. Data Visualization
- Responsive charts using Recharts
- Real-time updates as new entries are added
- Interactive legend filters
- Responsive for mobile

#### 5. Data Export
- CSV export of all entries
- Importable to spreadsheet or analytics tools
- Includes all metadata (timestamp, person, substance, initial/final/delta)

---

## Technical Architecture

### Tech Stack
- **Frontend**: React 18+ (Vite)
- **Styling**: Tailwind CSS + Dark Theme
- **Charts**: Recharts
- **State Management**: React hooks (Context API if needed)
- **Data Storage**: Browser localStorage + JSON file in iCloud
- **Hosting**: GitHub Pages (static hosting)
- **Deployment**: GitHub Actions (CI/CD)

### Project Structure
```
tracker/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── SubstanceForm.jsx
│   │   ├── QuickEntry.jsx
│   │   ├── HistoryView.jsx
│   │   ├── Dashboard.jsx
│   │   └── Navbar.jsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useSubstances.js
│   │   └── useEntries.js
│   ├── utils/           # Utility functions
│   │   ├── storage.js   # localStorage & JSON file handling
│   │   ├── calculations.js
│   │   └── export.js    # CSV export
│   ├── styles/          # CSS/Tailwind
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── .github/
│   └── workflows/       # GitHub Actions
│       └── deploy.yml
├── package.json
├── vite.config.js
├── tailwind.config.js
├── README.md
├── DEVLOG.md
├── PLAN.md
└── CODE.md
```

### Data Schema

#### tracker.json
```json
{
  "substances": [
    {
      "id": "uuid",
      "name": "Apollo",
      "theoreticalInitialMass": 50.0,
      "createdAt": "2026-01-02T00:00:00Z",
      "active": true
    }
  ],
  "entries": [
    {
      "id": "uuid",
      "substanceId": "uuid",
      "person": "Tristan",
      "initialMass": 47.0,
      "finalMass": 46.5,
      "delta": 0.5,
      "timestamp": "2026-01-02T12:30:00Z"
    }
  ],
  "metadata": {
    "version": "1.0",
    "lastUpdated": "2026-01-02T12:30:00Z"
  }
}
```

---

## User Flow

### Setup (First Time)
1. Open app in Safari
2. Add Apollo (theoretical initial: 50g)
3. Add Gramlin (theoretical initial: 45.5g)
4. Save to home screen
5. Download tracker.json to iCloud Files folder

### Daily Use
1. Open app from home screen
2. Select substance → person
3. Input initial mass, final mass
4. Tap save
5. View remaining mass updated in real-time
6. Periodically check dashboard for trends

### Analytics
1. Connect MacBook to same iCloud account
2. Access tracker.json from iCloud Files
3. Write custom analysis scripts (Python, etc.)
4. Plot trends, calculate statistics, etc.

---

## Implementation Phases

### Phase 1: MVP (Core Features)
- [x] Project scaffolding & documentation
- [ ] Data schema & storage utilities
- [ ] Substance management (add/edit/list)
- [ ] Quick entry screen
- [ ] Basic calculations (delta, remaining)
- [ ] Simple list view of entries
- [ ] Dark theme UI
- [ ] JSON file export

### Phase 2: Visualization & Polish
- [ ] Dashboard with charts (Recharts)
- [ ] Date range filtering
- [ ] CSV export
- [ ] Mobile optimization
- [ ] Home screen installability (PWA manifest)
- [ ] Performance optimization

### Phase 3: GitHub Pages & Deployment
- [ ] GitHub Pages setup
- [ ] GitHub Actions CI/CD
- [ ] Documentation finalization
- [ ] Testing & QA

---

## Design Principles

1. **Simplicity**: Minimal clicks to enter data; one flow for 95% of use cases
2. **Mobile-First**: Optimized for iPhone Safari (touch targets, readable on small screen)
3. **Dark Theme**: Easy on eyes, battery efficient on OLED screens
4. **Offline-Ready**: Works without internet; syncs when available
5. **Transparent Data**: User owns all data (JSON file in iCloud)
6. **Clean Code**: Well-documented, modular, maintainable

---

## Success Criteria

- [x] App opens in Safari and works on iPhone
- [ ] Can add substances with theoretical initial mass
- [ ] Can quickly enter initial/final mass and see delta calculated
- [ ] Remaining mass updates correctly: Theoretical - sum(deltas)
- [ ] Historical view shows all entries with person & timestamp
- [ ] Charts visualize trends clearly
- [ ] JSON file syncs to iCloud Files folder
- [ ] Can filter & export data
- [ ] Dark theme throughout
- [ ] No backend required; fully client-side
- [ ] Deployable to GitHub Pages

---

## Notes

- **Scale Fluctuation**: By tracking initial & final measurements, you smooth out scale error over time
- **Container Mass**: Becomes known when substance runs out (final remaining = 0)
- **Analytics**: External tools (Python, Excel, etc.) can analyze the JSON data
- **Extensibility**: Easy to add more substances without changing code
