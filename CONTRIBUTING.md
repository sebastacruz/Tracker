# Contributing to Substance Usage Tracker

Thank you for your interest in contributing to the Substance Usage Tracker! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

---

## Code of Conduct

This project aims to foster an inclusive and respectful community. When contributing:

- Be respectful and constructive in all interactions
- Focus on what is best for the community and project
- Accept constructive feedback graciously
- Show empathy towards other community members

---

## Getting Started

### Prerequisites

- Node.js v20.19.6 (managed via NVM recommended)
- npm (comes with Node.js)
- Git
- Code editor (VS Code recommended)

### Initial Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Tracker.git
   cd Tracker
   ```

3. **Install Node.js via NVM** (recommended):
   ```bash
   nvm install 20.19.6
   nvm use 20.19.6
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```
   Open http://localhost:5173/Tracker/ in your browser

6. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

---

## Development Workflow

### Branch Naming Conventions

- **Features**: `feature/descriptive-name` (e.g., `feature/add-user-auth`)
- **Bug fixes**: `fix/bug-description` (e.g., `fix/chart-rendering-issue`)
- **Documentation**: `docs/update-description` (e.g., `docs/improve-readme`)
- **Refactoring**: `refactor/area` (e.g., `refactor/storage-utilities`)

### Making Changes

1. **Make your changes** in your feature branch
2. **Test locally** to ensure everything works
3. **Run linting**:
   ```bash
   npm run lint
   ```
4. **Format code** with Prettier (should auto-format on save if configured)
5. **Build production bundle** to verify:
   ```bash
   npm run build
   ```

### Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short description>

<optional longer description>

<optional footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style/formatting (no logic changes)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(dashboard): add multi-substance chart filtering
fix(quick-entry): resolve delta calculation rounding error
docs(readme): update installation instructions
refactor(hooks): optimize useEntries hook performance
```

---

## Code Standards

### JavaScript/React Style

This project follows modern React and JavaScript best practices:

#### General Principles

- **Use functional components** with hooks (no class components)
- **Prefer const** over let; avoid var completely
- **Use arrow functions** for consistency
- **Destructure props** for readability
- **Use meaningful variable names** (avoid single letters except for loops)

#### React Patterns

```javascript
// ✅ Good - Functional component with hooks
import { useState, useEffect } from 'react'

function MyComponent({ initialValue }) {
  const [count, setCount] = useState(initialValue)

  useEffect(() => {
    // Effect logic
  }, [count])

  return <div>{count}</div>
}

// ❌ Avoid - Class components
class MyComponent extends React.Component {
  // Old pattern
}
```

#### File Organization

```javascript
// Import order:
// 1. React and external libraries
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

// 2. Custom hooks
import { useSubstances } from '../hooks/useSubstances'

// 3. Utilities
import { calculateDelta } from '../utils/calculations'

// 4. Components (if any)
import Button from './Button'
```

#### Naming Conventions

- **Components**: PascalCase (`QuickEntry.jsx`, `SubstanceManager.jsx`)
- **Hooks**: camelCase with "use" prefix (`useEntries.js`, `useSubstances.js`)
- **Utilities**: camelCase (`calculations.js`, `storage.js`)
- **Constants**: UPPER_SNAKE_CASE (`const MAX_ENTRIES = 1000`)
- **Regular variables**: camelCase (`const remainingMass = 45.5`)

### Tailwind CSS

- Use Tailwind utility classes instead of custom CSS when possible
- Group related utilities together
- Use responsive prefixes consistently (`sm:`, `md:`, `lg:`)
- Prefer dark mode utilities (`dark:bg-slate-800`)

```jsx
// ✅ Good - Clean utility usage
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                   dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors">
  Save
</button>

// ❌ Avoid - Inline styles (unless absolutely necessary)
<button style={{ padding: '8px 16px', backgroundColor: 'blue' }}>
  Save
</button>
```

### Code Formatting

This project uses **Prettier** for automatic code formatting:

- Line length: 80-100 characters (flexible)
- Indentation: 2 spaces
- Quotes: Single quotes for JavaScript, double for JSX attributes
- Semicolons: Optional (Prettier handles this)
- Trailing commas: ES5 style

Most editors can auto-format on save. Configure your editor to use the project's `.prettierrc` configuration.

---

## Pull Request Process

### Before Submitting

1. **Update documentation** if you've changed functionality
2. **Test thoroughly** on multiple screen sizes (mobile-first!)
3. **Run linting**: `npm run lint`
4. **Build successfully**: `npm run build`
5. **Update CHANGELOG.md** if appropriate (for significant changes)

### Submitting a Pull Request

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request** on GitHub from your fork to the main repository

3. **Fill out the PR template** with:
   - Clear description of the changes
   - Motivation and context
   - Screenshots (if UI changes)
   - Testing performed
   - Related issues (if any)

4. **Respond to review feedback** promptly

### PR Title Format

Follow the same convention as commit messages:

```
feat(dashboard): add export to PDF functionality
fix(storage): resolve localStorage quota exceeded error
docs(contributing): add code style guidelines
```

### Review Process

- At least one maintainer review required
- CI checks must pass (linting, build)
- No merge conflicts with main branch
- All discussions resolved

---

## Testing Guidelines

### Manual Testing Checklist

Before submitting a PR, test your changes:

#### Desktop Testing (Chrome/Firefox/Safari)
- [ ] Feature works as expected
- [ ] No console errors or warnings
- [ ] Responsive layout looks good
- [ ] Dark theme renders correctly

#### Mobile Testing (iPhone Safari - Primary Target)
- [ ] Touch targets are large enough (44x44px minimum)
- [ ] Dropdowns and inputs work properly
- [ ] Charts render and are interactive
- [ ] No horizontal scrolling
- [ ] Text is readable (min 16px font size)

#### localStorage Testing
- [ ] Data persists after page refresh
- [ ] Export/import works correctly
- [ ] Clear data function works

#### Edge Cases
- [ ] Empty state (no substances/entries)
- [ ] Large datasets (100+ entries)
- [ ] Very long substance names
- [ ] Decimal mass values
- [ ] Negative values (should be prevented)

### Future: Automated Testing

Automated tests are not yet implemented but would be valuable additions:

- Unit tests for utility functions (`calculations.js`, `storage.js`)
- Integration tests for hooks
- Component tests with React Testing Library
- E2E tests with Playwright or Cypress

---

## Documentation

### When to Update Documentation

Update documentation when you:

- Add or change features → Update [README.md](README.md)
- Modify data structures → Update [ARCHITECTURE.md](ARCHITECTURE.md)
- Add dependencies → Update [README.md](README.md) Tech Stack section
- Fix bugs → Consider adding to [CHANGELOG.md](CHANGELOG.md)
- Make development process changes → Update this file ([CONTRIBUTING.md](CONTRIBUTING.md))

### Documentation Style

- Use clear, concise language
- Include code examples where helpful
- Add screenshots for visual features
- Keep a conversational but professional tone
- Use Markdown formatting consistently

---

## Project-Specific Guidelines

### State Management

- Use custom hooks (`useSubstances`, `useEntries`) for data management
- Avoid prop drilling; pass data through context if needed
- Keep component state local when possible
- Use `useMemo` for expensive computations
- Use `useCallback` for functions passed to child components

### localStorage Strategy

All data operations should go through `storage.js`:

```javascript
import { getData, saveData } from '../utils/storage'

// ✅ Good - Use utility functions
const data = getData()
saveData({ substances, entries, metadata })

// ❌ Avoid - Direct localStorage access in components
localStorage.setItem('tracker_data', JSON.stringify(data))
```

### Performance Considerations

- Memoize expensive chart data calculations
- Avoid unnecessary re-renders with React.memo if needed
- Lazy load components if the bundle size grows
- Optimize images and assets for mobile

---

## Getting Help

If you have questions or need help:

1. **Check existing documentation**: [README.md](README.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DEVLOG.md](DEVLOG.md)
2. **Search existing issues** on GitHub
3. **Open a new issue** with detailed description
4. **Join discussions** on existing PRs or issues

---

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- CHANGELOG.md for significant contributions
- Future acknowledgments section if added

---

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Substance Usage Tracker! 🎉
