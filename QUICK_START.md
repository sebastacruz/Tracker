# Quick Reference

## Get Started Immediately

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:5173 in browser
# App will auto-open in your default browser
```

## Test on iPhone

1. Find your Mac IP: `ifconfig | grep inet | grep -v 127.0.0.1` (look for 192.168.x.x)
2. On iPhone Safari: `http://YOUR_IP:5173`
3. Test the features
4. Tap Share → Add to Home Screen to test PWA

## Project Commands

```bash
npm run dev      # Start development server (hot reload)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main app component with routing |
| `src/components/QuickEntry.jsx` | Main data entry screen |
| `src/hooks/useSubstances.js` | Substance state management |
| `src/hooks/useEntries.js` | Entry state management |
| `src/utils/storage.js` | localStorage, export/import |
| `src/utils/calculations.js` | Math and formatting |
| `src/styles/globals.css` | Tailwind CSS + utilities |
| `tailwind.config.js` | Dark theme config |
| `package.json` | Dependencies |

## Component Structure

```
App (main router)
├── Navbar (navigation)
├── QuickEntry (data entry) ← MAIN SCREEN
├── Dashboard (charts)
├── History (table view)
├── SubstanceManager (CRUD)
└── Settings (export/config)
```

## Data Flow

1. **User enters data** in QuickEntry
2. **Hook (useEntries)** processes and validates
3. **Calculation** (delta = initial - final)
4. **localStorage** saves automatically
5. **Components** re-render with new data
6. **Dashboard** shows updated charts
7. **Export** downloads JSON/CSV file
8. **iCloud** syncs exported file

## Common Tasks

### Add a Substance
1. Go to "Substances" tab
2. Click "Add New Substance"
3. Enter name & theoretical initial mass
4. Save

### Record Usage
1. Go to "Quick Entry" (default screen)
2. Select substance
3. Enter person name
4. Input initial mass
5. Input final mass
6. Delta calculates automatically
7. Click "Save Entry"

### View History
1. Go to "History" tab
2. See table of all entries
3. Filter by substance or person
4. View summary statistics
5. Delete entries if needed

### See Trends
1. Go to "Dashboard" tab
2. Select substance from dropdown
3. View charts:
   - Remaining over time
   - Usage by person
   - All substances overview

### Export Data
1. Go to "Settings" tab
2. Click "Download JSON" (backup)
3. Click "Download CSV" (spreadsheet)
4. Files download to your Downloads folder
5. Upload JSON to iCloud Drive

## Troubleshooting

### App won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Port already in use
```bash
# Kill process on port 5173
lsof -ti :5173 | xargs kill -9
npm run dev
```

### Data not showing
1. Refresh browser (Cmd+R)
2. Check browser console (F12)
3. Try clearing browser cache
4. Verify localStorage is enabled

### Charts not rendering
- Need at least 2 entries
- Make sure entries have different timestamps
- Check browser console for errors

## Deployment Steps (Later)

```bash
# 1. Build for production
npm run build

# 2. Initialize git
git init
git add .
git commit -m "Initial commit"

# 3. Create GitHub repo named "Tracker"

# 4. Push to GitHub
git branch -M main
git remote add origin https://github.com/username/Tracker.git
git push -u origin main

# 5. Enable GitHub Pages
# Settings → Pages → Source: main branch → Save

# 6. App available at:
# https://username.github.io/Tracker/
```

## Key Features Implemented

✅ Quick entry with auto-delta calculation  
✅ Substance management (add/delete)  
✅ Historical view with filtering  
✅ Interactive charts & dashboard  
✅ CSV & JSON export  
✅ Dark theme throughout  
✅ Mobile responsive  
✅ No backend required  
✅ Data persists locally  
✅ iCloud sync ready  

## File Locations

```
project-root/
├── src/components/      ← UI components
├── src/hooks/           ← State management
├── src/utils/           ← Helpers & math
├── src/styles/          ← CSS
├── README.md            ← User guide (START HERE)
├── PLAN.md              ← Feature details
├── CODE.md              ← Code conventions
├── DEVLOG.md            ← Development history
└── BUILD_SUMMARY.md     ← This build info
```

## Quick Test Checklist

- [ ] `npm install` runs without errors
- [ ] `npm run dev` starts server
- [ ] Browser opens to http://localhost:5173
- [ ] App displays without console errors
- [ ] Can add a substance
- [ ] Can record an entry
- [ ] Delta calculates correctly
- [ ] History table shows entry
- [ ] Dashboard charts render
- [ ] Export buttons work
- [ ] Dark theme looks good

## Resources

- React: https://react.dev
- Tailwind: https://tailwindcss.com
- Recharts: https://recharts.org
- Vite: https://vitejs.dev

## Need Help?

1. **Setup issues** → Check BUILD_SUMMARY.md
2. **How features work** → Read README.md
3. **Code questions** → See CODE.md
4. **Design decisions** → Check DEVLOG.md
5. **Feature details** → Review PLAN.md

---

**Ready to go!** Run `npm install && npm run dev` 🚀
