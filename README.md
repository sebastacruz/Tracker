# Dabta - Dab Usage Tracker

> Version 1.2.0 (1.3.0 pending) | [Live App](https://sebastacruz.github.io/Tracker/) | [Changelog](CHANGELOG.md)

A simple, privacy-first web app to track cannabis concentrate usage using mass measurements. Built for iPhone Safari with button-based interface, swipe navigation, and manual iCloud backup.

## ✨ What's New in v1.3.0 (Unreleased)

- 🎯 **Button-Based Interface** - Replaced all dropdowns with touch-friendly button grids
- 📊 **Simplified Dashboard** - Single chart view for cleaner analytics
- 🔀 **Settings as Swipeable Page** - Natural navigation flow (5 pages total)
- 🎨 **Minimal Navbar** - Removed title and gear icon for maximum content space
- ⚡ **Multi-Select Buttons** - Dashboard flavor selection with "Select All" / "Clear All"
- 🧹 **Cleaner Labels** - Removed "(tap to record)" helper text

## ✨ Recent Updates (v1.2.0)

- 🎨 **Rebranded to "Dabta"** - New identity with earth-green design system
- ⚡ **One-Tap Recording** - Preset dab sizes (Small/Regular/Large) for instant entry
- 👆 **Swipe Navigation** - Natural iOS-style page swiping between views
- 🎯 **Terminology Update** - "Flavors" instead of "Substances" for better UX
- 🎭 **Manrope Typography** - Professional, readable font across entire app
- ♿ **Accessibility Improvements** - ARIA labels, live regions, enhanced focus states

## ✨ Core Features

- 📊 **Track Multiple Flavors** - Manage unlimited concentrates (Apollo, Gramlin, custom)
- 🎯 **Quick Dab Entry** - Select flavor + person once, tap size button to record
- 📈 **Visual Analytics** - Interactive charts showing remaining mass and usage trends
- 📱 **Mobile-First** - Optimized for iPhone Safari with 112×76px touch targets
- ☁️ **Manual Sync** - Export JSON files to iCloud Drive for backup
- 📥 **Export Options** - Download data as CSV or JSON for external analysis
- 🌙 **Earth-Green Dark Theme** - Battery-efficient OLED-optimized design
- 🔒 **Privacy-First** - All data stays on your device; no backend or tracking

## 🚀 Quick Start

### For Users

1. **Access the app** → https://sebastacruz.github.io/Tracker/
2. **Add to home screen** (optional):
   - Open in Safari on iPhone
   - Tap Share → "Add to Home Screen"
   - Opens like a native app!
3. **Start tracking**:
   - Tap a flavor (or add your own in Flavors page)
   - Select a person
   - Tap dab size: Small (0.03g), Regular (0.04g), or Large (0.05g)
   - Swipe left to view analytics on Dashboard

### For Developers

```bash
# Clone and install
git clone https://github.com/sebastacruz/Tracker.git
cd Tracker
npm install

# Development server
npm run dev         # Opens at http://localhost:5173/Tracker/

# Production build
npm run build       # Outputs to docs/ folder

# Code quality
npm run lint        # Run ESLint checks
```

## 📊 How It Works

### Data Storage Strategy

- **Primary Storage**: Browser's localStorage (persists on your device)
- **Backup**: Manual export to JSON files → save to iCloud Drive
- **Analytics**: Import JSON/CSV into spreadsheet or Python for analysis
- **Privacy**: No backend, no cloud sync, no tracking - you own your data

### Sample Data

The app comes pre-loaded with sample data:
- 2 substances: Apollo, Gramlin
- 9 entries from January 1-2, 2026
- Users: `t` (7 entries), `e` (2 entries), `guest` (available)

You can clear this data anytime from the Settings view.

### Data Format

See [ARCHITECTURE.md](ARCHITECTURE.md#localstorage-schema) for complete JSON schema documentation.

## 🏗️ Project Structure

```
src/
├── components/          # React UI components
│   ├── App.jsx         # Main app with routing
│   ├── Navbar.jsx      # Navigation bar
│   ├── QuickEntry.jsx  # Primary data entry view
│   ├── Dashboard.jsx   # Analytics and charts
│   ├── History.jsx     # Entry history list
│   ├── SubstanceManager.jsx  # Substance CRUD
│   └── Settings.jsx    # Export/import & settings
├── hooks/              # Custom React hooks
│   ├── useSubstances.js  # Substance state management
│   └── useEntries.js     # Entry state management
├── utils/              # Helper functions
│   ├── calculations.js   # Mass calculations & stats
│   ├── storage.js        # localStorage & export/import
│   └── seedData.js       # Initial sample data
└── styles/
    └── globals.css     # Tailwind + custom dark theme
```

## 🛠️ Tech Stack

- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Styling**: Tailwind CSS 3.4.1 (earth-green dark theme)
- **Typography**: Manrope font family (Google Fonts)
- **Charts**: Recharts 2.10.3
- **Testing**: Vitest + React Testing Library + Playwright
- **Runtime**: Node.js v20.19.6 (via NVM)
- **Deployment**: GitHub Pages
- **Code Quality**: ESLint, Prettier, Pre-commit Hooks
- **CI/CD**: GitHub Actions

## 💻 Development

### Prerequisites

This project requires Node.js v20.19.6 (managed via NVM):

```bash
# Install/use correct Node version
nvm install 20.19.6
nvm use 20.19.6
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle → `docs/` folder |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code checks |
| `npm test` | Run test suite with Vitest |
| `npm run test:ui` | Open interactive test UI |
| `npm run test:coverage` | Generate coverage report |

### Deploying to GitHub Pages

```bash
npm run build          # Creates production build in docs/
git add docs/
git commit -m "Build production bundle"
git push origin main   # GitHub Pages auto-deploys from docs/
```

### Testing

The project includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Watch mode (auto-reruns on file changes)
npm test -- --watch

# Coverage report
npm run test:coverage

# Interactive UI
npm run test:ui
```

**Test Coverage**:
- ✅ **104 total tests** (100% passing)
- ✅ **100% coverage** on calculations.js (61 unit tests)
- ✅ **100% function coverage** on hooks (27 integration tests)
- ✅ **Performance tests** with 200+ entries (16 tests)
- ✅ Test execution: <1 second

**What's Tested**:
- Pure calculation functions (delta, remaining mass, statistics)
- Custom hooks (useSubstances, useEntries)
- localStorage persistence
- State management and CRUD operations
- Edge cases (zero, negative, large numbers)
- Performance validation with realistic datasets

### Code Conventions

- **Language**: JavaScript (ES6+) with JSX
- **Style Guide**: Prettier (auto-format on save)
- **Linting**: ESLint with React plugin
- **Components**: Functional components with hooks
- **Pre-commit Hooks**: Auto-format and lint before commits

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed development guidelines.

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [CHANGELOG.md](CHANGELOG.md) | Version history and release notes |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture and data flow diagrams |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Development workflow and contribution guidelines |
| [DEVLOG.md](DEVLOG.md) | Development history and technical decisions |

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Setting up your development environment
- Code style guidelines
- Pull request process
- Testing procedures

## 🐛 Troubleshooting

### Data not persisting after browser refresh
- Check that localStorage is enabled in your browser settings
- Export JSON backup regularly from Settings view

### Charts not displaying
- Ensure you have at least 2 entries with different dates
- Try clearing and re-adding sample data from Settings

### Build errors with npm
- Verify Node.js version: `nvm use 20.19.6`
- Clear node_modules: `rm -rf node_modules && npm install`

For more help, see [DEVLOG.md](DEVLOG.md) or open an issue on GitHub.

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

Built with modern web technologies:
- React team for the excellent framework
- Recharts for beautiful, responsive charts
- Tailwind CSS for rapid UI development
- Vite for lightning-fast development experience

---

**Built for precise substance tracking** | [Report Issues](https://github.com/sebastacruz/Tracker/issues)
