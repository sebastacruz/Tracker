# Code Style Guide

## Overview
This document outlines code conventions, style guidelines, and best practices for the Substance Usage Tracker project.

## Language & Tools

- **Language**: JavaScript (ES2020+)
- **Dialect**: JSX (React 18)
- **Linter**: ESLint
- **Formatter**: Prettier (auto-format on save)
- **Package Manager**: npm

---

## General Principles

1. **Readability Over Cleverness**: Write code that's easy to understand
2. **DRY (Don't Repeat Yourself)**: Extract reusable logic into utilities/hooks
3. **SOLID Principles**: Single responsibility, open/closed, etc.
4. **Functional Programming**: Prefer functional components, hooks, pure functions
5. **Explicit Over Implicit**: Clear variable names, documented functions

---

## Naming Conventions

### Files & Directories

```
// Components (PascalCase, .jsx)
src/components/QuickEntry.jsx
src/components/Dashboard.jsx

// Hooks (camelCase with 'use' prefix, .js)
src/hooks/useSubstances.js
src/hooks/useEntries.js

// Utilities (camelCase, .js)
src/utils/storage.js
src/utils/calculations.js
src/utils/export.js

// Styles (camelCase, .css)
src/styles/globals.css

// Directories (kebab-case)
src/components/
src/hooks/
src/utils/
```

### Variables & Functions

```javascript
// Constants (UPPER_SNAKE_CASE)
const DEFAULT_THEME = 'dark';
const MAX_ENTRIES = 1000;

// Variables (camelCase)
let currentSubstance = null;
const userData = { name: 'John' };

// Functions (camelCase)
function calculateRemaining(theoretical, deltas) { }
const handleSubmit = () => { };

// Boolean functions/variables (prefix with 'is', 'has', 'can')
const isLoading = false;
const hasError = true;
const canExport = entries.length > 0;

// Event handlers (prefix with 'handle')
const handleClick = () => { };
const handleInputChange = (e) => { };

// React Hooks (prefix with 'use')
const useSubstances = () => { };
const useFetch = (url) => { };
```

### React Components

```javascript
// Component names are PascalCase
export default function QuickEntry() { }

export const SubstanceForm = () => { }
```

---

## Code Structure

### React Components

```javascript
// src/components/MyComponent.jsx
import React, { useState } from 'react';
import { someUtil } from '../utils/helpers';
import '../styles/mycomponent.css';

/**
 * Brief description of component
 * 
 * @param {object} props - Component props
 * @param {string} props.title - The component title
 * @returns {React.ReactElement}
 */
export default function MyComponent({ title, onSubmit }) {
  // 1. State declarations
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  // 2. Custom hooks
  const { substances, addSubstance } = useSubstances();

  // 3. Event handlers
  const handleClick = () => {
    // Handle click logic
  };

  // 4. Side effects (useEffect)
  React.useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // 5. Render/return
  return (
    <div className="...">
      {/* JSX here */}
    </div>
  );
}
```

### Custom Hooks

```javascript
// src/hooks/useSubstances.js
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook for managing substances
 * 
 * @returns {object} - { substances, addSubstance, updateSubstance, deleteSubstance }
 */
export const useSubstances = () => {
  const [substances, setSubstances] = useState([]);

  const addSubstance = useCallback((name, theoreticalMass) => {
    const newSubstance = {
      id: uuidv4(),
      name,
      theoreticalInitialMass: theoreticalMass,
      createdAt: new Date().toISOString(),
      active: true,
    };
    setSubstances(prev => [...prev, newSubstance]);
    return newSubstance;
  }, []);

  return { substances, addSubstance };
};
```

### Utility Functions

```javascript
// src/utils/calculations.js
/**
 * Calculate mass delta (amount consumed)
 * 
 * @param {number} initialMass - Initial mass in grams
 * @param {number} finalMass - Final mass in grams
 * @returns {number} - Delta mass (initial - final)
 */
export function calculateDelta(initialMass, finalMass) {
  return Number((initialMass - finalMass).toFixed(2));
}

/**
 * Calculate remaining mass for a substance
 * 
 * @param {number} theoreticalMass - Theoretical initial mass
 * @param {array} deltas - Array of usage deltas
 * @returns {number} - Remaining mass
 */
export function calculateRemaining(theoreticalMass, deltas) {
  const totalUsed = deltas.reduce((sum, delta) => sum + delta, 0);
  return Number((theoreticalMass - totalUsed).toFixed(2));
}
```

---

## JavaScript & React Standards

### Imports

```javascript
// Group imports: external, internal, styles
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { calculateDelta } from '../utils/calculations';
import { useSubstances } from '../hooks/useSubstances';
import '../styles/quickentry.css';
```

### Props & Destructuring

```javascript
// Destructure props at function signature
function Component({ title, isLoading, onSubmit }) {
  // Use title, isLoading, onSubmit directly
}

// For complex props, consider PropTypes or TypeScript
import PropTypes from 'prop-types';

Component.propTypes = {
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};
```

### Conditional Rendering

```javascript
// Prefer ternary for simple conditions
{isLoading ? <Spinner /> : <Content />}

// Use logical && for single branch
{hasError && <ErrorMessage />}

// Avoid nested ternaries; use if/else or helper function
function renderStatus() {
  if (isLoading) return <Spinner />;
  if (hasError) return <ErrorMessage />;
  return <Content />;
}
```

### Array Operations

```javascript
// Use array methods (map, filter, reduce)
const activeSubstances = substances.filter(s => s.active);
const names = substances.map(s => s.name);

// Avoid direct mutation
// ❌ Don't: array[0] = newValue;
// ✅ Do: [...array.slice(0, 1), newValue, ...array.slice(1)]

// For state updates
setSubstances(prev => 
  prev.map(s => s.id === id ? { ...s, name } : s)
);
```

### Async/Await

```javascript
// Prefer async/await over .then()
async function loadData() {
  try {
    const data = await fetchData();
    setData(data);
  } catch (error) {
    console.error('Failed to load data:', error);
    setError(error.message);
  }
}

// In useEffect
useEffect(() => {
  const fetchAndSet = async () => {
    try {
      const result = await getData();
      setResult(result);
    } catch (err) {
      setError(err);
    }
  };
  
  fetchAndSet();
}, []);
```

---

## Styling (Tailwind CSS)

### Class Organization

```javascript
// Classes grouped by purpose
<div className="
  // Layout
  flex flex-col gap-4
  // Spacing
  p-4 my-2
  // Sizing
  w-full max-w-md
  // Colors (dark theme)
  bg-slate-900 text-white
  // Responsive
  md:flex-row lg:p-6
">
  {/* content */}
</div>
```

### Dark Theme

```javascript
// Always design for dark theme first
// Example: light content on dark background
<div className="bg-slate-900 text-slate-100">
  {/* Default dark theme */}
</div>

// Optional light theme override (not implemented in v1)
<div className="dark:bg-slate-900 dark:text-slate-100 bg-white text-slate-900">
  {/* Light/dark toggle example (future) */}
</div>
```

### Responsive Design

```javascript
// Mobile-first approach
<div className="
  // Mobile (default)
  w-full p-4 text-base
  // Tablet
  md:max-w-2xl md:p-6
  // Desktop
  lg:max-w-4xl lg:p-8
">
  {/* Content */}
</div>
```

---

## Comments & Documentation

### File Headers

```javascript
/**
 * QuickEntry.jsx
 * 
 * Main component for entering substance usage data.
 * Allows user to select substance, person, and input masses.
 * Auto-calculates usage delta.
 */
```

### Function/Component Comments

```javascript
/**
 * Calculate remaining substance mass
 * 
 * @param {number} theoretical - Theoretical initial mass (grams)
 * @param {Array<number>} usageDeltas - Array of usage amounts
 * @returns {number} - Calculated remaining mass
 * 
 * @example
 * const remaining = calculateRemaining(50, [0.5, 0.3, 0.2]);
 * // returns 49
 */
export function calculateRemaining(theoretical, usageDeltas) {
  // ...
}
```

### Inline Comments

```javascript
// Use sparingly; code should be self-documenting
const delta = initialMass - finalMass; // Mass consumed in this session

// Explain *why*, not *what*
// We round to 2 decimals to match scale precision
const rounded = Number(value.toFixed(2));
```

### TODO Comments

```javascript
// Use TODO for incomplete work (include name/date)
// TODO: Add date range filtering to Dashboard (TM - 2026-01-02)
```

---

## Error Handling

### Try/Catch

```javascript
try {
  const data = JSON.parse(jsonString);
  return data;
} catch (error) {
  console.error('Invalid JSON:', error);
  throw new Error('Failed to parse data');
}
```

### Component Error Boundaries

```javascript
// Create error boundary for critical sections
class ErrorBoundary extends React.Component {
  // ... implementation
}

export default ErrorBoundary;
```

---

## Performance Tips

1. **Memoization**: Use `useMemo` for expensive calculations
   ```javascript
   const remaining = useMemo(() => 
     calculateRemaining(theoretical, deltas),
     [theoretical, deltas]
   );
   ```

2. **Callbacks**: Use `useCallback` for event handlers passed as props
   ```javascript
   const handleSubmit = useCallback((data) => {
     // handler logic
   }, [dependencies]);
   ```

3. **Lazy Loading**: Code-split components with React.lazy
   ```javascript
   const Dashboard = React.lazy(() => import('./Dashboard'));
   ```

4. **Avoid Prop Drilling**: Use Context API for deeply nested state
   ```javascript
   const DataContext = React.createContext();
   ```

---

## Testing (Future)

### Unit Tests (Jest)

```javascript
// __tests__/calculations.test.js
import { calculateDelta, calculateRemaining } from '../utils/calculations';

describe('calculateDelta', () => {
  it('calculates difference between initial and final mass', () => {
    expect(calculateDelta(50, 49.5)).toBe(0.5);
  });
});
```

### Component Tests (React Testing Library)

```javascript
import { render, screen } from '@testing-library/react';
import QuickEntry from '../components/QuickEntry';

describe('QuickEntry', () => {
  it('renders form fields', () => {
    render(<QuickEntry />);
    expect(screen.getByLabelText(/initial mass/i)).toBeInTheDocument();
  });
});
```

---

## Git Workflow

### Commit Messages

```
// Format: [Type] Brief description

[feat] Add dashboard charts component
[fix] Correct delta calculation rounding
[docs] Update README with deployment steps
[style] Format QuickEntry component
[refactor] Extract storage logic to custom hook
[test] Add unit tests for calculations
[chore] Update dependencies
```

### Branch Naming

```
feature/dashboard-charts
fix/delta-calculation
docs/update-readme
```

---

## Linting & Formatting

### ESLint Config

```javascript
// .eslintrc.cjs
module.exports = {
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  rules: {
    'no-unused-vars': ['warn'],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
```

### Prettier Config

```javascript
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 80
}
```

---

## Summary Checklist

Before committing code:

- [ ] No console.logs in production code
- [ ] No `var`, only `const`/`let`
- [ ] Functions are documented (JSDoc)
- [ ] Component props are typed (PropTypes or comments)
- [ ] Variable names are clear and descriptive
- [ ] No unused imports or variables
- [ ] Tailwind classes are organized logically
- [ ] Dark theme is applied correctly
- [ ] Mobile-first responsive design
- [ ] No hardcoded values (use constants)
- [ ] Error handling in place
- [ ] Code runs without ESLint warnings

---

## Questions?

Refer to code examples in existing components or ask for clarification.
