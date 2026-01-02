# Substance Usage Tracker

A simple, mobile-first web app to track substance consumption using mass measurements. Built for iPhone Safari with automatic iCloud syncing.

## Features

- 📊 **Track Multiple Substances**: Apollo, Gramlin, or any custom substance
- ⚖️ **Mass-Based Tracking**: Input initial & final mass; auto-calculates usage
- 📈 **Visual Dashboard**: See remaining mass & usage trends at a glance
- 📱 **iPhone Optimized**: Works perfectly in Safari, save to home screen
- ☁️ **iCloud Sync**: Data stored in JSON file synced to your iCloud Files folder
- 📥 **Export Data**: CSV export for external analytics
- 🌙 **Dark Theme**: Easy on the eyes, battery-efficient
- ⚡ **No Backend**: All data stays on your device; fully private

## Quick Start

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sebastacruz/Tracker.git
   cd Tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/Tracker/` in your browser

4. **Build for production** (GitHub Pages):
   ```bash
   npm run build
   ```

### Usage on iPhone

1. **Access the app**:
   - **Development**: `http://YOUR_MAC_IP:5173/Tracker/`
   - **Live (GitHub Pages)**: `https://sebastacruz.github.io/Tracker/`

2. **First time**:
   - App loads with sample data (Apollo & Gramlin with 9 entries from Jan 1-2, 2026)
   - You can immediately see historical data and charts
   - Add your own substances as needed

3. **Daily use**:
   - Select substance and person (t, e, or guest)
   - Input initial mass → final mass
   - Tap save
   - View updated remaining mass and trends

4. **Save to home screen**: 
   - Tap the share icon in Safari
   - Select "Add to Home Screen"
   - Opens like a native app

### Data Storage

- **Primary**: Browser's localStorage (on your phone)
- **Backup/Sync**: Export to JSON file in iCloud Files folder
- **Analytics**: Read the JSON file from your Mac to analyze data externally
- **Seed Data**: App comes pre-loaded with sample data (2 substances, 9 entries from Jan 1-2, 2026)

**Users in seed data**: t (7 entries), e (2 entries), guest (available)

**Data format**: See [PLAN.md](PLAN.md#data-schema) for JSON schema

## Project Structure

```
src/
├── components/        # React UI components
├── hooks/             # Custom React hooks for state management
├── utils/             # Helper functions (storage, calculations, export)
├── styles/            # Tailwind CSS configuration
└── App.jsx            # Main app component
```

## Development

### Prerequisites

This project uses Node.js managed via NVM (Node Version Manager). To build the project:

1. **Ensure NVM is installed**:
   ```bash
   nvm --version
   ```

2. **Use the correct Node version**:
   ```bash
   nvm use 20.19.6
   # or install if needed:
   nvm install 20.19.6
   ```

### Available Scripts

```bash
npm run dev          # Start development server (hot reload)
npm run build        # Build for production (outputs to docs/ folder)
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Building for GitHub Pages

The project is configured to build to the `docs/` folder for GitHub Pages deployment:

```bash
# Build the production bundle
npm run build

# Commit changes
git add -A
git commit -m "Your commit message"

# Push to GitHub (triggers GitHub Pages deployment)
git push origin main
```

**Note**: If using NVM and npm isn't in your PATH, you can use the full path:
```bash
export PATH="$HOME/.nvm/versions/node/v20.19.6/bin:$PATH"
npm run build
```

### Code Style

- **Language**: JavaScript/JSX (React 18)
- **Styling**: Tailwind CSS with dark theme
- **Formatting**: Prettier (auto-formatted on save)
- **Linting**: ESLint

See [CODE.md](CODE.md) for detailed code conventions.

## Data Flow

```
iPhone Safari App
    ↓
 React Components
    ↓
 localStorage (browser)
    ↓
 JSON file (iCloud Files)
    ↓
 Mac analytics tools
```

## Features Explained

### Quick Entry
- One screen for 95% of your data entry
- Select substance → person → initial mass → final mass → save
- Auto-calculates delta (mass consumed)

### Dashboard
- Remaining mass over time (interactive chart)
- Usage trends per substance
- Filter by date range, substance, or person
- Real-time updates

### Historical View
- All entries listed by date (newest first)
- See who used what, when, and how much
- Search and filter capabilities

### Export
- Download as CSV for spreadsheet analysis
- Includes timestamps, person, substance, masses, and delta
- Import into your tracking spreadsheet

## Deployment (GitHub Pages)

1. Push code to GitHub
2. GitHub Actions automatically builds and deploys
3. App available at `https://yourusername.github.io/tracker/`
4. Open in Safari on iPhone and add to home screen

See `.github/workflows/deploy.yml` for CI/CD setup.

## Configuration

### Adding a New Substance

In the app:
1. Tap "Add Substance"
2. Enter name (e.g., "Apollo")
3. Enter theoretical initial mass (e.g., 50g)
4. Save

No code changes needed!

### Customizing Dark Theme

Edit `src/styles/globals.css` to adjust colors, or modify the Tailwind config in `tailwind.config.js`.

## Troubleshooting

**"Data not syncing to iCloud"**
- Ensure you've downloaded the `tracker.json` file from the app
- Check that your iPhone is signed into iCloud
- Verify the file is in the correct folder

**"Lost data after closing Safari"**
- Browser localStorage persists across sessions
- Always export/sync JSON to ensure backup
- Consider enabling iCloud sync in your app settings

**"Charts not displaying"**
- Ensure you have entries with different dates
- Charts need at least 2 data points to show trends

## Contributing

This is a personal project, but feel free to suggest improvements via issues or PRs!

## License

MIT License - See LICENSE file for details

## Support

For questions or issues:
1. Check [PLAN.md](PLAN.md) for feature details
2. Review [CODE.md](CODE.md) for code documentation
3. Check [DEVLOG.md](DEVLOG.md) for development notes

---

**Built with** ❤️ for precise substance tracking.
