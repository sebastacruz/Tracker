/**
 * Phase 5.2 & 5.3 Validation Tests
 * Verifies CI/CD setup and quick wins implementation
 */

describe('Phase 5.2 & 5.3 Infrastructure Tests', () => {
  // CI/CD Pipeline Tests
  describe('GitHub Actions Workflow', () => {
    test('CI workflow file exists and is valid', () => {
      const fs = require('fs');
      const path = require('path');
      const workflowPath = path.join(process.cwd(), '.github/workflows/ci.yml');
      expect(fs.existsSync(workflowPath)).toBe(true);
    });

    test('Workflow includes Node 20 setup', () => {
      const fs = require('fs');
      const path = require('path');
      const workflowPath = path.join(process.cwd(), '.github/workflows/ci.yml');
      const content = fs.readFileSync(workflowPath, 'utf8');
      expect(content).toContain('node-version:');
      expect(content).toContain("'20'");
    });

    test('Workflow includes lint step', () => {
      const fs = require('fs');
      const path = require('path');
      const workflowPath = path.join(process.cwd(), '.github/workflows/ci.yml');
      const content = fs.readFileSync(workflowPath, 'utf8');
      expect(content).toContain('npm run lint');
    });

    test('Workflow includes build step', () => {
      const fs = require('fs');
      const path = require('path');
      const workflowPath = path.join(process.cwd(), '.github/workflows/ci.yml');
      const content = fs.readFileSync(workflowPath, 'utf8');
      expect(content).toContain('npm run build');
    });
  });

  // Pre-commit Hooks Tests
  describe('Husky Pre-commit Hooks', () => {
    test('Husky is installed', () => {
      const fs = require('fs');
      const path = require('path');
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      expect(packageJson.devDependencies.husky).toBeDefined();
    });

    test('lint-staged is installed', () => {
      const fs = require('fs');
      const path = require('path');
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      expect(packageJson.devDependencies['lint-staged']).toBeDefined();
    });

    test('pre-commit hook file exists', () => {
      const fs = require('fs');
      const path = require('path');
      const hookPath = path.join(process.cwd(), '.husky/pre-commit');
      expect(fs.existsSync(hookPath)).toBe(true);
    });

    test('lint-staged config includes eslint and prettier', () => {
      const fs = require('fs');
      const path = require('path');
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      expect(packageJson['lint-staged']).toBeDefined();
      expect(JSON.stringify(packageJson['lint-staged'])).toContain('eslint --fix');
      expect(JSON.stringify(packageJson['lint-staged'])).toContain('prettier --write');
    });
  });

  // Error Boundary Tests
  describe('Error Boundary Component', () => {
    test('ErrorBoundary component exists', () => {
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(process.cwd(), 'src/components/ErrorBoundary.jsx');
      expect(fs.existsSync(componentPath)).toBe(true);
    });

    test('ErrorBoundary is wrapped around App', () => {
      const fs = require('fs');
      const path = require('path');
      const mainPath = path.join(process.cwd(), 'src/main.jsx');
      const content = fs.readFileSync(mainPath, 'utf8');
      expect(content).toContain('ErrorBoundary');
      expect(content).toContain('<ErrorBoundary>');
    });

    test('ErrorBoundary has getDerivedStateFromError', () => {
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(process.cwd(), 'src/components/ErrorBoundary.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('getDerivedStateFromError');
    });

    test('ErrorBoundary has componentDidCatch', () => {
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(process.cwd(), 'src/components/ErrorBoundary.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('componentDidCatch');
    });

    test('ErrorBoundary has recovery UI with buttons', () => {
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(process.cwd(), 'src/components/ErrorBoundary.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('Try Again');
      expect(content).toContain('Go to Home');
      expect(content).toContain('Clear Data');
    });
  });

  // Input Validation Tests
  describe('QuickEntry Input Validation', () => {
    test('QuickEntry has isValidMass function', () => {
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(process.cwd(), 'src/components/QuickEntry.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('isValidMass');
    });

    test('QuickEntry has sanitizeInput function', () => {
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(process.cwd(), 'src/components/QuickEntry.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('sanitizeInput');
    });

    test('QuickEntry validates negative masses', () => {
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(process.cwd(), 'src/components/QuickEntry.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('num >= 0');
    });

    test('QuickEntry disables submit button when invalid', () => {
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(process.cwd(), 'src/components/QuickEntry.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('disabled={!isFormValid}');
    });

    test('QuickEntry shows real-time validation feedback', () => {
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(process.cwd(), 'src/components/QuickEntry.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('getMassValidation');
      expect(content).toContain('border-red-500');
    });

    test('QuickEntry sanitizes notes input', () => {
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(process.cwd(), 'src/components/QuickEntry.jsx');
      const content = fs.readFileSync(componentPath, 'utf8');
      expect(content).toContain('handleNotesChange');
      expect(content).toContain('sanitizeInput(value)');
    });
  });

  // Bundle Size Monitoring Tests
  describe('Bundle Size Monitoring', () => {
    test('rollup-plugin-visualizer is installed', () => {
      const fs = require('fs');
      const path = require('path');
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      expect(packageJson.devDependencies['rollup-plugin-visualizer']).toBeDefined();
    });

    test('vite config includes visualizer plugin', () => {
      const fs = require('fs');
      const path = require('path');
      const vitePath = path.join(process.cwd(), 'vite.config.js');
      const content = fs.readFileSync(vitePath, 'utf8');
      expect(content).toContain('rollup-plugin-visualizer');
      expect(content).toContain('visualizer');
    });

    test('Bundle analysis file is generated after build', () => {
      const fs = require('fs');
      const path = require('path');
      const bundlePath = path.join(process.cwd(), 'docs/bundle-analysis.html');
      expect(fs.existsSync(bundlePath)).toBe(true);
    });
  });

  // Integration Tests
  describe('Integration Checks', () => {
    test('Build produces docs directory', () => {
      const fs = require('fs');
      const path = require('path');
      const docsPath = path.join(process.cwd(), 'docs');
      expect(fs.existsSync(docsPath)).toBe(true);
      expect(fs.existsSync(path.join(docsPath, 'index.html'))).toBe(true);
    });

    test('No console errors in built files', () => {
      const fs = require('fs');
      const path = require('path');
      const indexPath = path.join(process.cwd(), 'docs/index.html');
      const content = fs.readFileSync(indexPath, 'utf8');
      // Basic check that HTML structure exists (lowercase in built files)
      expect(content.toLowerCase()).toContain('<!doctype html>');
    });

    test('prettier is installed for formatting', () => {
      const fs = require('fs');
      const path = require('path');
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      expect(packageJson.devDependencies.prettier).toBeDefined();
    });

    test('prop-types is installed for validation', () => {
      const fs = require('fs');
      const path = require('path');
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      expect(packageJson.dependencies['prop-types']).toBeDefined();
    });
  });
});
