# CLAUDE.md - Substance Usage Tracker Development Guide
*Comprehensive development instructions for Claude Code - Optimized for React/Vite projects*

---

## Quick Reference

### Common Commands
```bash
# Development
npm run dev              # Start dev server (http://localhost:5173/Tracker/)
npm run build            # Production build → docs/
npm run preview          # Preview production build
npm run lint             # Run ESLint

# Git workflow
git status               # Check changes
git add .                # Stage all
git commit -m "msg"      # Commit
git push origin main     # Push & deploy
```

### File Locations
- **Components**: `src/components/*.jsx`
  - ConfirmDialog.jsx - Reusable confirmation modal
  - PullToRefreshIndicator.jsx - Visual pull-to-refresh feedback
- **Hooks**: `src/hooks/*.js`
  - usePullToRefresh.js - Pull-to-refresh gesture detection
- **Utils**: `src/utils/*.js`
- **Styles**: `src/styles/globals.css`
- **Config**: `vite.config.js`, `tailwind.config.js`

---

## 1. Project Context

### Technology Stack
- **Framework**: React 18.2.0 (functional components + hooks)
- **Build Tool**: Vite 5.0.8
- **Styling**: Tailwind CSS 3.4.1 (dark theme only)
- **Charts**: Recharts 2.10.3
- **State**: Custom hooks (useSubstances, useEntries)
- **Storage**: Browser localStorage
- **Deployment**: GitHub Pages (docs/ folder)

### Core Architecture
```
User Input → React Components → Custom Hooks → Utils → localStorage
                    ↓
              Recharts (Charts) → Dashboard/History Views
```

### Data Flow
1. User interacts with UI (QuickEntry, SubstanceManager, etc.)
2. Component calls custom hook method (addEntry, addSubstance)
3. Hook updates state and calls `saveData()` from `storage.js`
4. Data persists to localStorage
5. All components re-render with updated state

---

## 2. Code Standards

### React Patterns

**Component Structure**:
```jsx
import { useState, useEffect, useMemo } from 'react'
import { useSubstances } from '../hooks/useSubstances'
import { calculateDelta } from '../utils/calculations'

function ComponentName({ prop1, prop2 }) {
  const [localState, setLocalState] = useState(initialValue)
  const { substances, addSubstance } = useSubstances()

  // Memoize expensive calculations
  const derivedValue = useMemo(() => {
    return expensiveCalculation(substances)
  }, [substances])

  // Event handlers
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle logic
  }

  return (
    <div className="card">
      {/* JSX */}
    </div>
  )
}

export default ComponentName
```

**Hooks Usage**:
- Use `useState` for component-local state
- Use `useEffect` for side effects (sparingly)
- Use `useMemo` for expensive computations
- Use `useCallback` for function memoization (when passed as props)
- Use custom hooks (useSubstances, useEntries) for data operations

**State Management Rules**:
- Never modify state directly
- Use setter functions: `setState(newValue)`
- For objects/arrays, create new references: `setState({ ...old, new })`
- All data operations go through custom hooks

### JavaScript Conventions

**Naming**:
- Components: `PascalCase` (QuickEntry, SubstanceManager)
- Hooks: `camelCase` with "use" prefix (useEntries, useSubstances)
- Files: Match component/function name
- Variables/functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

**Import Order**:
```javascript
// 1. React and external libraries
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

// 2. Custom hooks
import { useEntries } from '../hooks/useEntries'

// 3. Utils
import { calculateDelta } from '../utils/calculations'

// 4. Components
import Button from './Button'
```

**Avoid**:
- Class components (use functional only)
- `var` (use const/let)
- Direct localStorage access (use storage.js)
- Inline styles (use Tailwind)
- Any mutations of state

### Tailwind CSS

**Usage Pattern**:
```jsx
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white
                   rounded-lg transition-colors dark:bg-blue-500">
  Save
</button>
```

**Custom Classes** (defined in globals.css):
- `.card` - Card container with padding and border
- `.btn-primary` - Primary action button
- `.btn-danger` - Destructive action button
- `.input-base` - Standard input styling
- `.label-base` - Standard label styling

**Dark Theme**:
- This app uses dark theme ONLY
- Use `dark:` prefix for dark-specific styles
- Background: `bg-slate-950`
- Text: `text-slate-50`
- Borders: `border-slate-800`

---

## 3. Project-Specific Guidelines

### Data Management

**localStorage Schema**:
```javascript
{
  "substances": [
    {
      "id": "uuid",
      "name": "Apollo",
      "theoreticalInitialMass": 1.0,
      "createdAt": "ISO-8601",
      "active": true
    }
  ],
  "entries": [
    {
      "id": "uuid",
      "substanceId": "uuid",
      "person": "t",
      "initialMass": 47.0,
      "finalMass": 46.5,
      "delta": 0.5,
      "timestamp": "ISO-8601",
      "notes": "optional"
    }
  ],
  "metadata": {
    "version": "1.0",
    "lastUpdated": "ISO-8601"
  }
}
```

**Always use storage.js for data operations**:
```javascript
import { getData, saveData } from '../utils/storage'

// ✅ Good
const data = getData()
saveData({ substances, entries, metadata })

// ❌ Bad - Never do this
const data = JSON.parse(localStorage.getItem('tracker_data'))
```

### Custom Hooks Usage

**useSubstances.js**:
```javascript
const {
  substances,      // Array of substance objects
  addSubstance,    // (name, theoreticalMass) => void
  deleteSubstance, // (id) => void
  updateSubstance  // (id, updates) => void
} = useSubstances()
```

**useEntries.js**:
```javascript
const {
  entries,       // Array of entry objects
  addEntry,      // (substanceId, person, initialMass, finalMass, notes) => void
  deleteEntry,   // (id) => void
  updateEntry    // (id, updates) => void
} = useEntries()
```

### Calculation Utilities

**All calculations must use utils/calculations.js**:
```javascript
import {
  calculateDelta,           // (initial, final) => delta
  calculateRemaining,       // (theoreticalMass, entries) => remaining
  getSubstanceStats,        // (substance, entries) => { total, avg, etc }
  formatMass                // (number) => "X.XX g"
} from '../utils/calculations'
```

### Component Organization

**App.jsx** - Main router, holds global state
**Navbar.jsx** - View switcher
**QuickEntry.jsx** - Primary data entry (default view)
**Dashboard.jsx** - Charts and analytics
**History.jsx** - Entry list with filters
**SubstanceManager.jsx** - Substance CRUD
**Settings.jsx** - Export/import, data management

**Adding a New Component**:
1. Create file in `src/components/ComponentName.jsx`
2. Use functional component with hooks
3. Import in `App.jsx` if needed for routing
4. Add to navigation in `Navbar.jsx` if it's a view

---

## 4. Common Tasks

### Adding a New Feature

**Process**:
1. Plan the feature (which components affected?)
2. Update data schema if needed (see localStorage schema)
3. Add utility functions if needed (calculations.js, storage.js)
4. Update custom hooks if new data operations needed
5. Create/modify components
6. Test manually in browser
7. Run `npm run lint` to check code quality
8. Build and verify: `npm run build`
9. Commit with descriptive message
10. Push to deploy

**Example: Adding a "favorite" flag to substances**:
```javascript
// 1. Update schema (in storage.js or hook initialization)
const newSubstance = {
  id: uuidv4(),
  name,
  theoreticalInitialMass,
  favorite: false,  // NEW
  createdAt: new Date().toISOString(),
  active: true
}

// 2. Add toggle function to useSubstances
const toggleFavorite = (id) => {
  setSubstances(prev => prev.map(s =>
    s.id === id ? { ...s, favorite: !s.favorite } : s
  ))
}

// 3. Update UI in SubstanceManager.jsx
<button onClick={() => toggleFavorite(substance.id)}>
  {substance.favorite ? '⭐' : '☆'}
</button>
```

### Fixing a Bug

**Process**:
1. Reproduce the bug in browser
2. Identify affected component(s)
3. Use browser DevTools React extension to inspect state
4. Check console for errors
5. Review component logic and data flow
6. Fix and test
7. Verify no regressions
8. Document fix in commit message

**Common Issues**:
- **State not updating**: Check if using setter correctly, not mutating
- **Charts not showing**: Check data format, ensure entries exist
- **Data lost on refresh**: Check if saveData() is called
- **Deployment broken**: Check Vite base path in vite.config.js

### Modifying Styles

**For global changes**:
- Edit `src/styles/globals.css`
- Use Tailwind `@apply` for reusable classes

**For component-specific**:
- Add Tailwind classes directly to JSX
- Use existing custom classes when possible

**Testing styles**:
1. Run dev server: `npm run dev`
2. Open browser, test on desktop
3. Use browser DevTools to simulate mobile
4. Check dark theme rendering

---

## 5. Testing Strategy

### Manual Testing Checklist

**Before Every Commit**:
- [ ] Feature works as expected
- [ ] No console errors or warnings
- [ ] Data persists after refresh
- [ ] Dark theme renders correctly
- [ ] Responsive on mobile (DevTools)

**Major Changes**:
- [ ] All views render correctly
- [ ] Navigation works
- [ ] Charts display with data
- [ ] Export/import functions
- [ ] No breaking changes to existing features

### Browser Testing

**Primary Target**: Safari on iPhone (iOS 15+)

**Also Test**:
- Chrome desktop
- Safari desktop
- Firefox (optional)

**DevTools Simulation**:
1. Open Chrome DevTools (F12)
2. Click device toolbar (or Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar
4. Test touch interactions

---

## 6. Deployment Workflow

### Standard Deployment

```bash
# 1. Ensure changes are committed
git status

# 2. Build production bundle
npm run build

# 3. Add build to git
git add docs/

# 4. Commit with message
git commit -m "build: production build for v1.x.x"

# 5. Push to GitHub (triggers GitHub Pages)
git push origin main

# 6. Verify deployment (wait 2-3 minutes)
# Visit: https://sebastacruz.github.io/Tracker/
```

### Build Verification

Before pushing:
```bash
npm run preview   # Test production build locally
# Open http://localhost:4173/Tracker/
# Test all features
```

### GitHub Pages Setup

- **Source**: `main` branch → `docs/` folder
- **Base Path**: `/Tracker/` (configured in vite.config.js)
- **Deployment**: Automatic on push to main

---

## 7. Troubleshooting

### Build Issues

**"npm command not found"**:
```bash
nvm use 20.19.6
export PATH="$HOME/.nvm/versions/node/v20.19.6/bin:$PATH"
```

**Build fails with errors**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Runtime Issues

**Data not persisting**:
- Check browser localStorage is enabled
- Verify saveData() is called after state changes
- Check browser console for quota errors

**Charts not rendering**:
- Verify data format matches Recharts expectations
- Check that entries array has valid data
- Ensure at least 2 data points for trends

**Styles not applying**:
- Check Tailwind class names are correct
- Verify globals.css is imported in main.jsx
- Clear browser cache and rebuild

### Git Issues

**Push fails**:
- Ensure you're on main branch: `git branch`
- Pull latest changes: `git pull origin main`
- Resolve conflicts if any
- Push again: `git push origin main`

---

## 8. Version Management

### Semantic Versioning

This project follows [SemVer](https://semver.org/):
- **Major (X.0.0)**: Breaking changes
- **Minor (1.X.0)**: New features (backward compatible)
- **Patch (1.0.X)**: Bug fixes

### Updating Version

When releasing a new version:

1. **Update package.json**:
```json
{
  "version": "1.1.0"
}
```

2. **Update CHANGELOG.md**:
```markdown
## [1.1.0] - 2026-01-XX

### Added
- New feature description

### Changed
- Improvement description

### Fixed
- Bug fix description
```

3. **Update README.md** (version badge at top)

4. **Commit with version tag**:
```bash
git add package.json CHANGELOG.md README.md
git commit -m "chore: bump version to 1.1.0"
git tag v1.1.0
git push origin main --tags
```

---

## 9. Important Reminders

### Do's ✅
- Always use custom hooks for data operations
- Memoize expensive calculations with useMemo
- Keep components small and focused
- Use Tailwind classes instead of inline styles
- Test on mobile (or DevTools simulation)
- Run `npm run lint` before committing
- Update CHANGELOG.md for significant changes
- Use descriptive commit messages

### Don'ts ❌
- Never mutate state directly
- Don't use class components
- Don't access localStorage directly
- Don't use inline styles
- Don't commit without testing
- Don't push broken builds
- Don't skip linting
- Don't create new files without updating this guide

### Code Review Checklist

Before committing any change:
- [ ] Code follows React/JavaScript conventions
- [ ] No console.log statements (use console.warn/error if needed)
- [ ] PropTypes warnings addressed (or suppressed if intentional)
- [ ] No unused variables or imports
- [ ] Tailwind classes used correctly
- [ ] Dark theme considered
- [ ] Data flow uses proper hooks/utils
- [ ] No breaking changes (or documented in CHANGELOG)

---

## 10. Quick Fixes for Common Scenarios

### "I need to add a new field to entries"

1. Update `useEntries.js` initialization
2. Update `addEntry` function to accept new parameter
3. Update `QuickEntry.jsx` form to include new input
4. Update seed data in `seedData.js` to include field
5. Update `History.jsx` to display new field if relevant
6. Test export/import to ensure compatibility

### "I need to add a new calculation"

1. Add function to `utils/calculations.js`
2. Export the function
3. Import in component that needs it
4. Use the calculation result in render or useMemo

### "I need to modify the UI layout"

1. Identify component to modify
2. Update JSX with new Tailwind classes
3. Test in browser (desktop + mobile DevTools)
4. Verify dark theme looks correct

### "I need to change how data is stored"

1. Update schema in `storage.js` or hook
2. Add migration logic if needed (for existing users)
3. Update seed data
4. Test export/import compatibility
5. Update ARCHITECTURE.md with new schema

---

## 11. Resources

### Documentation
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org/)

### Project Files
- [README.md](README.md) - User documentation
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contributor guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [DEVLOG.md](DEVLOG.md) - Development notes

### Tools
- React DevTools (browser extension)
- Chrome DevTools for mobile simulation
- ESLint for code quality
- Prettier for formatting

---

## 12. Contact & Support

**For bugs or feature requests**:
- Open an issue on GitHub: https://github.com/sebastacruz/Tracker/issues

**For development questions**:
- Refer to this CLAUDE.md
- Check ARCHITECTURE.md for data flow
- Review CONTRIBUTING.md for workflows

---

*Last updated: 2026-01-03*
*Version: 1.0.0*
