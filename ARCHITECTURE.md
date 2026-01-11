# Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              iPhone Safari Browser / Web App                │
│  (React + Tailwind + Recharts - Dark Theme Optimized)       │
└────────────────┬────────────────────────────────────────────┘
                 │
         ┌───────▼────────┐
         │   App.jsx      │
         │  (Router)      │
         └───────┬────────┘
                 │
      ┌──────────┼──────────────────────┬────────────┬──────┐
      │          │                      │            │      │
 ┌────▼──┐ ┌────▼──────┐ ┌────────▼───┐ │      ┌────▼──┐   │
 │Navbar │ │QuickEntry │ │SubstanceMgr│ │   ┌──▼─History    │
 │       │ │(Main)     │ │            │ │   │              │
 └───────┘ └────┬──────┘ └────────────┘ │   │         ┌────▼──┐
               │                        │   │         │Settings
               │                    ┌───┴───┴───┐     │
               │                    │ Dashboard │     │
               │                    └───────────┘     │
               │                                       │
       ┌───────▼────────┐
       │  useEntries    │
       │  (Hook)        │
       └────────┬───────┘
                │
       ┌────────▼──────────┐
       │  useSubstances    │
       │  (Hook)           │
       └────────┬──────────┘
                │
    ┌───────────▼────────────┐
    │   Utilities            │
    │  ┌────────────────────┐│
    │  │ calculations.js    ││
    │  │  - calculateDelta  ││
    │  │  - getRemaining    ││
    │  │  - formatters      ││
    │  └────────────────────┘│
    │  ┌────────────────────┐│
    │  │ storage.js         ││
    │  │  - getData         ││
    │  │  - saveData        ││
    │  │  - exportJSON      ││
    │  │  - exportCSV       ││
    │  └────────────────────┘│
    └───────────┬────────────┘
                │
        ┌───────▼──────────┐
        │ Browser Storage  │
        │  localStorage    │
        │ (tracker_data)   │
        └───────┬──────────┘
                │
        ┌───────▼──────────────┐
        │  User's Device       │
        │  (iPhone Memory)     │
        │  ┌────────────────┐  │
        │  │ substances[] │  │
        │  │ entries[]      │  │
        │  │ metadata       │  │
        │  └────────────────┘  │
        └────────┬─────────────┘
                 │
    ┌────────────▼──────────────┐
    │  User Exports (Manual)    │
    │  JSON / CSV Files         │
    └────────────┬──────────────┘
                 │
        ┌────────▼─────────┐
        │  iCloud Drive    │
        │  (Backup/Sync)   │
        └────────┬─────────┘
                 │
        ┌────────▼──────────┐
        │ Mac Analytics     │
        │ (Python/Excel)    │
        └───────────────────┘
```

---

## Component Hierarchy

```
App
│
├─ Navbar
│  ├─ View selector (buttons)
│  └─ Mobile hamburger menu
│
├─ QuickEntry (View 1: DEFAULT)
│  ├─ useEntries hook
│  ├─ Substance selector
│  ├─ Person input (datalist)
│  ├─ Initial mass input
│  ├─ Final mass input
│  ├─ Delta display (auto-calculated)
│  ├─ Submit button
│  └─ Help text
│
├─ Dashboard (View 2)
│  ├─ Substance selector
│  ├─ LineChart (Remaining over time)
│  ├─ BarChart (Usage by person)
│  └─ BarChart (All substances)
│
├─ History (View 3)
│  ├─ Filter controls
│  │  ├─ Substance filter
│  │  └─ Person filter
│  ├─ Entry table
│  │  ├─ Headers
│  │  └─ Rows (sortable)
│  └─ Summary stats
│
├─ SubstanceManager (View 4)
│  ├─ Add substance form
│  │  ├─ Name input
│  │  ├─ Theoretical mass input
│  │  └─ Submit button
│  └─ Substance cards grid
│     ├─ Stats
│     ├─ Progress bar
│     └─ Delete button
│
└─ Settings (View 5)
   ├─ Export section
   │  ├─ JSON export button
   │  ├─ CSV export button
   │  └─ Data stats
   ├─ iCloud guide
   ├─ FAQ
   └─ Danger zone (clear data)
```

---

## Data Flow Diagram

### Adding a Substance

```
User Input
  │
  ├─ Name: "Apollo"
  ├─ Mass: "50.0"
  │
  ▼
SubstanceManager Component
  │
  ▼
useSubstances Hook → addSubstance()
  │
  ├─ Generate UUID
  ├─ Create substance object
  ├─ Add to state
  │
  ▼
saveData() (storage.js)
  │
  ▼
localStorage.setItem('tracker_data', JSON)
  │
  ▼
Component re-renders
  │
  ▼
User sees updated list ✓
```

### Recording Usage

```
User Input (QuickEntry)
  │
  ├─ Substance: UUID-abc
  ├─ Person: "Tristan"
  ├─ Initial: 47.0g
  ├─ Final: 46.5g
  │
  ▼
useEntries Hook → addEntry()
  │
  ├─ Call calculateDelta(47.0, 46.5)
  │  └─ Returns: 0.5g
  │
  ├─ Generate UUID for entry
  ├─ Create entry object with:
  │  ├─ Delta: 0.5
  │  ├─ Timestamp: now
  │  ├─ All inputs
  │
  ├─ Add to entries[] array
  │
  ▼
saveData() → localStorage
  │
  ▼
All components re-render
  │
  ├─ History shows new entry
  ├─ Dashboard recalculates remaining
  └─ Display updates instantly ✓
```

### Calculating Remaining Mass

```
getSubstanceRemaining(substance, entries)
  │
  ├─ Filter entries by substance ID
  │  └─ [entry1, entry2, entry3]
  │
  ├─ Extract deltas
  │  └─ [0.5, 0.3, 0.2]
  │
  ├─ Sum deltas
  │  └─ totalUsed = 1.0g
  │
  ├─ Calculate remaining
  │  └─ Remaining = 50.0 - 1.0 = 49.0g
  │
  ├─ Round to 2 decimals
  │  └─ 49.00g
  │
  └─ Return: 49.0
      │
      └─ Displayed in SubstanceManager
         & Dashboard charts
```

### Exporting Data

```
User clicks "Export CSV"
  │
  ▼
Settings.jsx → exportAsCSV()
  │
  ├─ Get entries array
  ├─ Get substances array
  │
  ▼
Create substance lookup:
  { "uuid-abc": "Apollo", "uuid-def": "Gramlin" }
  │
  ▼
Create CSV content:
  ┌─────────────────────────────────────┐
  │Date,Time,Substance,Person,...       │
  │2026-01-02,12:30:00,Apollo,Tristan,...
  │2026-01-02,12:45:00,Apollo,Tristan,...
  │...                                  │
  └─────────────────────────────────────┘
  │
  ▼
Create Blob & download
  │
  └─ File: tracker-2026-01-02.csv ✓
```

---

## State Management Flow

```
App
├─ useSubstances Hook
│  ├─ State: substances[]
│  ├─ Reads from: localStorage on mount
│  ├─ Updates: 
│  │  ├─ addSubstance(name, mass)
│  │  ├─ updateSubstance(id, updates)
│  │  └─ deleteSubstance(id)
│  └─ Syncs to: localStorage automatically
│
├─ useEntries Hook
│  ├─ State: entries[]
│  ├─ Reads from: localStorage on mount
│  ├─ Updates:
│  │  ├─ addEntry(substanceId, person, initial, final)
│  │  ├─ updateEntry(id, initial, final)
│  │  └─ deleteEntry(id)
│  └─ Syncs to: localStorage automatically
│
└─ Derived Data:
   ├─ Charts data (recalculated on change)
   ├─ Filters (client-side in components)
   ├─ Statistics (calculated from entries)
   └─ Remaining mass (calculated from deltas)
```

---

## localStorage Schema

```
Browser localStorage
│
└─ Key: "tracker_data"
   Value: JSON String
   │
   └─ {
       "substances": [
         {
           "id": "uuid-1",
           "name": "Apollo",
           "theoreticalInitialMass": 50.0,
           "totalInitialMass": null,
           "finalMass": null,
           "createdAt": "ISO-8601",
           "active": true
         }
       ],
       "entries": [
         {
           "id": "uuid-2",
           "substanceId": "uuid-1",
           "person": "Tristan",
           "initialMass": 47.0,
           "finalMass": 46.5,
           "delta": 0.5,
           "timestamp": "ISO-8601"
         }
       ],
       "metadata": {
         "version": "1.0",
         "lastUpdated": "ISO-8601"
       }
     }
```

---

## Calculation Pipeline

```
User Input
  │
  ├─ initialMass: 47.0
  ├─ finalMass: 46.5
  │
  ▼
calculateDelta(47.0, 46.5)
  │
  ├─ Validate inputs (typeof === 'number')
  ├─ Subtract: 47.0 - 46.5 = 0.5
  ├─ Round to 2 decimals: 0.50
  │
  └─ Return: 0.5
      │
      ▼
    Stored in entry object
      │
      ▼
calculateRemaining(theoreticalMass, [deltas...])
  │
  ├─ theoretical = 50.0 (Apollo)
  ├─ deltas = [0.5, 0.3, 0.2, ...]
  │
  ├─ Sum deltas: 0.5 + 0.3 + 0.2 + ... = totalUsed
  ├─ Subtract: 50.0 - totalUsed = remaining
  ├─ Round to 2 decimals
  │
  └─ Return: remaining mass
      │
      ▼
    Displayed in:
    ├─ SubstanceManager cards
    ├─ History view
    ├─ Dashboard charts
    └─ Settings statistics
```

---

## Component Lifecycle

### QuickEntry Component

```
Mount
  │
  ├─ useEntries hook initialized
  │  └─ Loads entries from localStorage
  │
  ├─ useSubstances hook (from parent)
  │  └─ Already loaded
  │
  ├─ Form state initialized
  │  ├─ selectedSubstance: ""
  │  ├─ selectedPerson: ""
  │  ├─ initialMass: ""
  │  ├─ finalMass: ""
  │  └─ delta: null
  │
  └─ Render initial UI
      └─ Focus on initialMass input

User Interaction
  │
  ├─ Types initial mass: "47"
  │  └─ Calculate delta → display
  │
  ├─ Types final mass: "46.5"
  │  └─ Update delta → display
  │
  ├─ Clicks Save
  │  ├─ Validate all fields
  │  ├─ Call addEntry()
  │  ├─ Reset form
  │  ├─ Show success message
  │  └─ Auto-clear after 3s
  │
  └─ Done!

Unmount
  │
  └─ Component cleanup
     └─ State preserved in localStorage
```

---

## Export Process

```
CSV Export Flow:
│
├─ Get substances: [Apollo, Gramlin]
├─ Get entries: [...all 100 entries]
│
├─ Create lookup:
│  { "uuid-abc": "Apollo" }
│
├─ Map each entry to CSV row:
│  Date | Time | Substance | Person | Initial | Final | Delta
│
├─ Create CSV string:
│  │Header row
│  │Row 1
│  │Row 2
│  │...
│  │Row N
│
├─ Create Blob from string
├─ Create download link
├─ Trigger browser download
│
└─ File saved: tracker-2026-01-02.csv ✓

JSON Export Flow:
│
├─ Get complete state:
│  { substances, entries, metadata }
│
├─ Pretty-print JSON (2-space indent)
│
├─ Create Blob from string
├─ Create download link
├─ Trigger browser download
│
└─ File saved: tracker-2026-01-02.json ✓
```

---

## Data Persistence Strategy

```
User Action
  │
  ├─ Add substance
  ├─ Record entry
  ├─ Delete entry
  ├─ Edit substance
  │
  ▼
State Hook Updates
  │
  ├─ Validate data
  ├─ Generate IDs if needed
  ├─ Update React state
  │
  ▼
Component Re-renders
  │
  ├─ UI updates instantly
  │
  ▼
saveData() Called
  │
  ├─ Serialize state to JSON
  ├─ Set lastUpdated timestamp
  │
  ▼
localStorage.setItem()
  │
  └─ Data persists to disk ✓
     Survives:
     ├─ Page refresh
     ├─ Browser restart
     ├─ App close/open
     └─ Even if browser crashes

Manual Export (Periodic)
  │
  └─ User clicks Export
     ├─ JSON file downloaded
     └─ Uploaded to iCloud Drive
        (For backup & analysis)
```

---

## Mobile Optimization Flow

```
iPhone Safari Request
  │
  ├─ DNS lookup
  ├─ HTTPS connection
  ├─ Load HTML (index.html)
  │
  ▼
Download Assets
  │
  ├─ React bundle (~40KB gzip)
  ├─ Tailwind CSS (~15KB gzip)
  ├─ Recharts (~80KB gzip)
  │
  ▼
Initialize React
  │
  ├─ Mount App component
  ├─ Load from localStorage
  ├─ Render UI
  │
  ▼
Display
  │
  ├─ Dark theme applied
  ├─ Responsive layout activated
  ├─ Touch handlers ready
  │
  └─ Ready for user input ✓

User Adds to Home Screen
  │
  ├─ PWA manifest detected
  ├─ Installable!
  │
  └─ Opens like native app
     ├─ No Safari UI
     ├─ Full screen
     ├─ Fast launch
     └─ Perfect UX ✓
```

---

**Architecture designed for simplicity, reliability, and user privacy.**
