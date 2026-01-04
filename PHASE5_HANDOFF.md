# Phase 5 Execution - Handoff Prompt for Claude Code

**Date**: January 3, 2026
**Project**: Substance Usage Tracker (v1.0.0 → v1.1.0)
**Working Directory**: `/Users/tristanmcvay/dev/Tracker`

---

## 🎯 Mission

Execute **Phase 5: Code Quality & Testing Foundation** using parallel agent orchestration. This phase establishes security validation, testing infrastructure, scalability confidence, and automated quality gates to enable rapid feature development.

**Time Budget**: 10-14 hours (8-11 wall time with parallelization)
**Execution Strategy**: 5 specialized agents across 3 parallel execution groups

---

## 📋 Context

### Project State
- **Version**: 1.0.0 (production-ready, live on GitHub Pages)
- **Codebase**: ~1,861 lines React/Vite app
- **Architecture**: Excellent (custom hooks, clean separation)
- **Documentation**: Comprehensive (README, ARCHITECTURE, DEVLOG, CLAUDE.md)
- **Testing**: None (zero automated tests)
- **CI/CD**: None (manual build and deploy)
- **Security**: Unvalidated (no formal security review)

### Phase 5 Goals
1. ✅ Security validation (no XSS, dependency vulnerabilities, data leaks)
2. ✅ Testing foundation (15-25 tests, >80% coverage on critical paths)
3. ✅ Scalability validation (performance with 20 substances, 200+ entries)
4. ✅ Automated quality gates (CI/CD, pre-commit hooks)

### Success Metrics
- Zero high/critical security vulnerabilities
- Test coverage: >80% on utils, >60% on hooks
- App load time with 20 substances: <2s
- Charts render in <500ms
- CI pipeline running on every PR
- Pre-commit hooks enforcing code quality

---

## 🤖 Agent Execution Plan

### **Group 1: Assessment Phase** (Run in Parallel)

#### Agent A: Security Specialist
```
Launch Task agent with:
- Model: haiku (cost-effective for scanning)
- Description: "Security review and vulnerability assessment"
- Prompt:

You are a security specialist conducting a comprehensive security review of the Tracker React/Vite application.

**Your Task**: Complete Phase 5.1 Security Review as documented in DEVLOG.md (lines 388-415)

**Inputs Available**:
- Code review template: code_review_templates/security_review/javascript_security_review.md
- Codebase: src/components/*.jsx
- Dependencies: package.json, package-lock.json

**Your Deliverables**:
1. Run npm audit and document results
2. Scan all components for XSS patterns (focus on QuickEntry, Dashboard, History)
3. Validate localStorage security (data sanitization, input validation)
4. Check for secrets/API keys in code
5. Generate security findings report: docs/security-review.md

**Success Tests** (you MUST pass all):
- [ ] npm audit completed with results documented
- [ ] All components scanned for XSS patterns
- [ ] localStorage security validated
- [ ] Report generated in docs/security-review.md with severity ratings

**Iteration Criteria**:
- If critical vulnerabilities found → suggest immediate fixes and iterate
- If dependencies outdated → provide upgrade commands
- Iterate until zero high/critical issues remain

**Output Format**: Markdown report with:
- Executive summary
- Vulnerability list (severity, location, remediation)
- Dependency audit results
- XSS pattern analysis
- Recommended actions (P0, P1, P2)

Work autonomously. Test your findings. Iterate until all success tests pass.
```

#### Agent B: Code Quality Analyzer
```
Launch Task agent with:
- Model: haiku
- Description: "Code quality scan and complexity analysis"
- Prompt:

You are a code quality engineer analyzing the Tracker React/Vite application.

**Your Task**: Complete Phase 5.1 Code Quality Scan as documented in DEVLOG.md (lines 399-415)

**Inputs Available**:
- Code review template: code_review_templates/code_quality/javascript_code_quality.md
- Codebase: all src/ files
- ESLint config: .eslintrc.cjs

**Your Deliverables**:
1. Run ESLint and document violation count/types
2. Calculate cyclomatic complexity for all functions
3. Analyze component sizes (identify >400 line components)
4. Check import organization compliance
5. Identify refactoring candidates
6. Generate code quality report: docs/code-quality-review.md

**Success Tests** (you MUST pass all):
- [ ] ESLint run completed with violation count
- [ ] Complexity scores calculated for all functions
- [ ] Component size analysis complete
- [ ] Report generated in docs/code-quality-review.md

**Iteration Criteria**:
- If any function has cyclomatic complexity >15 → flag for refactoring
- If any component >400 lines → suggest splitting
- Iterate until baseline documented

**Focus Areas**:
- src/utils/calculations.js (226 lines of pure logic)
- src/components/Dashboard.jsx (307 lines - largest component)
- src/components/SubstanceManager.jsx (250 lines)

**Output Format**: Markdown report with:
- Code quality metrics summary
- Complexity hotspots (sorted by severity)
- ESLint violations categorized
- Refactoring priorities (P0, P1, P2)
- Baseline metrics for future comparison

Work autonomously. Iterate until all success tests pass.
```

**Wait for Group 1 completion before proceeding to Group 2**

---

### **Group 2: Implementation Phase** (Run in Parallel)

#### Agent C: Test Engineer
```
Launch Task agent with:
- Model: sonnet (better at test generation)
- Description: "Test infrastructure setup and implementation"
- Prompt:

You are a test engineer setting up comprehensive testing infrastructure for the Tracker app.

**Your Task**: Complete Phase 5.2 Essential Testing Foundation as documented in DEVLOG.md (lines 418-497)

**Inputs Available**:
- Testing template: code_review_templates/testing_review/javascript_testing_review.md
- Pure functions to test: src/utils/calculations.js
- Hooks to test: src/hooks/useSubstances.js, src/hooks/useEntries.js

**Your Deliverables**:
1. Install Vitest + React Testing Library:
   npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitest/ui @vitest/coverage-v8

2. Create vitest.config.js with proper configuration

3. Create setupTests.js for test utilities

4. Write unit tests: tests/unit/calculations.test.js
   - Test calculateDelta(initial, final)
   - Test calculateRemaining(theoreticalMass, entries)
   - Test getSubstanceStats(substance, entries)
   - Test formatMass(number)
   - Cover edge cases: 0, negative, very large numbers
   - Target: 80%+ coverage on calculations.js

5. Write integration tests: tests/integration/hooks.test.js
   - Test useSubstances: addSubstance, deleteSubstance, updateSubstance
   - Test useEntries: addEntry, deleteEntry, updateEntry
   - Test localStorage persistence
   - Test state updates
   - Target: Happy path + error cases

6. Update package.json with test scripts:
   "test": "vitest",
   "test:ui": "vitest --ui",
   "test:coverage": "vitest --coverage"

**Success Tests** (you MUST pass all):
- [ ] All tests pass (npm run test)
- [ ] Coverage >80% on calculations.js
- [ ] Coverage >60% on hooks
- [ ] Tests run in <10 seconds
- [ ] Coverage report generated

**Iteration Criteria**:
- If any test fails → fix implementation or test
- If coverage <80% on calculations → add edge case tests
- Iterate until all success tests pass

**Output Format**:
- Test files with comprehensive coverage
- Test run output showing all passing
- Coverage report summary

Work autonomously. Write tests, run them, iterate until all pass with required coverage.
```

#### Agent D: DevOps Engineer
```
Launch Task agent with:
- Model: haiku
- Description: "CI/CD setup and quick wins implementation"
- Prompt:

You are a DevOps engineer setting up automated quality gates and quick wins.

**Your Task**: Complete Phase 5.2 CI/CD + Phase 5.3 Quick Wins as documented in DEVLOG.md (lines 465-586)

**Your Deliverables**:

1. **CI/CD Setup**:
   - Create .github/workflows/ci.yml (run tests, lint, build on PR)
   - Ensure workflow uses Node 20
   - Block merge if tests fail

2. **Pre-commit Hooks**:
   - Install: npm install -D husky lint-staged
   - Configure .husky/pre-commit to run lint + format
   - Test that it blocks bad commits

3. **Error Boundary Component**:
   - Create src/components/ErrorBoundary.jsx
   - Wrap App in ErrorBoundary (update src/main.jsx)
   - Display user-friendly fallback UI
   - Log errors for debugging

4. **Input Validation**:
   - Update src/components/QuickEntry.jsx:
     - Prevent negative mass values (both initial and final)
     - Sanitize notes input (prevent XSS)
     - Show real-time validation feedback
     - Disable submit button until valid

5. **Bundle Size Monitoring**:
   - Install: npm install -D rollup-plugin-visualizer
   - Configure in vite.config.js
   - Generate bundle analysis report

**Success Tests** (you MUST pass all):
- [ ] CI workflow runs successfully (create test PR if needed)
- [ ] Pre-commit hook blocks unformatted code
- [ ] Error boundary catches test errors
- [ ] Negative mass inputs rejected with clear feedback
- [ ] Bundle size report generated

**Iteration Criteria**:
- If CI fails → debug workflow syntax
- If pre-commit doesn't block → fix hook configuration
- Iterate until all workflows green

**Output Format**:
- Working CI/CD pipeline
- Functional pre-commit hooks
- Error boundary component integrated
- Enhanced input validation working

Work autonomously. Set up infrastructure, test it, iterate until all success tests pass.
```

**Wait for Group 2 completion before proceeding to Group 3**

---

### **Group 3: Validation Phase** (Run Sequentially)

#### Agent E: Performance Tester
```
Launch Task agent with:
- Model: haiku
- Description: "Scalability validation and performance profiling"
- Prompt:

You are a performance engineer validating scalability with realistic production data.

**Your Task**: Complete Phase 5.3 Scalability Validation as documented in DEVLOG.md (lines 504-586)

**Prerequisite**: Group 2 must be complete (tests working)

**Your Deliverables**:

1. **Large Dataset Generation**:
   - Create tests/fixtures/large-dataset.json
   - 20 substances with varied theoretical masses (1g - 100g)
   - 200+ entries distributed across:
     - 3 people ('t', 'a', 'm')
     - Last 6 months time period
     - Realistic usage patterns
   - Follow pattern in src/utils/seedData.js

2. **Performance Profiling**:
   - Load large dataset into app
   - Measure SubstanceManager render time (target: <1s)
   - Measure Dashboard chart rendering (target: <500ms)
   - Measure History filtering performance (200+ entries)
   - Check localStorage size (target: <1MB)
   - Test export/import with large dataset

3. **Mobile Simulation**:
   - Use browser DevTools mobile simulation (iPhone 13)
   - Test dropdown performance (20 items)
   - Test chart rendering on mobile
   - Check for UI jank during scrolling

4. **Generate Report**:
   - Create docs/performance-baseline.md
   - Document all metrics
   - Identify any bottlenecks
   - Recommend optimizations if needed

**Success Tests** (you MUST pass all):
- [ ] Large dataset generates successfully
- [ ] App loads with dataset in <2s
- [ ] Charts render in <500ms
- [ ] No memory leaks detected
- [ ] localStorage size <1MB
- [ ] Report generated in docs/performance-baseline.md

**Iteration Criteria**:
- If performance issues found → profile with browser DevTools
- If memory leaks → identify component causing leak
- Iterate until all success tests pass

**Output Format**:
- Large dataset fixture
- Performance metrics report
- Bottleneck analysis (if any)
- Optimization recommendations

Work autonomously. Generate data, profile performance, iterate until metrics meet targets.
```

---

## 📊 Execution Checklist

### Before Starting
- [ ] Read DEVLOG.md Phase 5 section completely
- [ ] Confirm code review templates accessible at code_review_templates/
- [ ] Confirm working directory is /Users/tristanmcvay/dev/Tracker
- [ ] Understand success metrics and quality gates

### Group 1: Assessment (Parallel)
- [ ] Launch Agent A (Security Specialist)
- [ ] Launch Agent B (Code Quality Analyzer)
- [ ] Wait for both to complete
- [ ] Review docs/security-review.md and docs/code-quality-review.md

### Group 2: Implementation (Parallel)
- [ ] Launch Agent C (Test Engineer)
- [ ] Launch Agent D (DevOps Engineer)
- [ ] Wait for both to complete
- [ ] Verify tests pass: npm run test
- [ ] Verify CI workflow exists and runs
- [ ] Verify pre-commit hooks work

### Group 3: Validation (Sequential)
- [ ] Launch Agent E (Performance Tester)
- [ ] Wait for completion
- [ ] Review docs/performance-baseline.md
- [ ] Verify all metrics meet targets

### Post-Execution
- [ ] All 5 agents completed successfully
- [ ] All success tests passed
- [ ] All deliverables generated
- [ ] Update DEVLOG.md with Phase 5 completion status
- [ ] Update CHANGELOG.md (version 1.1.0 preparation)
- [ ] Create summary report of achievements

---

## 🎯 Launch Commands

**To execute this plan, run these commands in sequence:**

### Group 1 (Parallel - run both at once)
```
# Launch both agents in same message for parallel execution
Agent A: Security Specialist (haiku) - Security review
Agent B: Code Quality Analyzer (haiku) - Code quality scan
```

### Group 2 (Parallel - run both at once, after Group 1 completes)
```
# Launch both agents in same message for parallel execution
Agent C: Test Engineer (sonnet) - Test implementation
Agent D: DevOps Engineer (haiku) - CI/CD + quick wins
```

### Group 3 (Sequential - run after Group 2 completes)
```
# Launch single agent
Agent E: Performance Tester (haiku) - Scalability validation
```

---

## 📝 Success Criteria Summary

**Phase 5 is complete when ALL of these are true**:

### Security
- ✅ Zero high/critical vulnerabilities
- ✅ Zero XSS attack vectors
- ✅ All dependencies up-to-date or patched
- ✅ Security report generated

### Testing
- ✅ Test coverage >80% on utils, >60% on hooks
- ✅ 15-25 tests passing consistently
- ✅ Test suite runs in <10 seconds
- ✅ Coverage reports generated

### Performance
- ✅ App loads in <2s with 20 substances
- ✅ Charts render in <500ms
- ✅ localStorage size <1MB
- ✅ No UI jank on mobile

### CI/CD
- ✅ CI pipeline runs on every PR
- ✅ Pre-commit hooks enforce quality
- ✅ Error boundary protects app
- ✅ Input validation prevents bad data

### Documentation
- ✅ docs/security-review.md
- ✅ docs/code-quality-review.md
- ✅ docs/performance-baseline.md
- ✅ DEVLOG.md updated with Phase 5 results
- ✅ README.md updated with testing instructions

---

## 🚨 Important Notes

### Agent Iteration
- Agents MUST iterate until their success tests pass
- Agents should work autonomously without waiting for human input
- If blocked >1 hour, agent should document blocker and suggest workaround

### Parallel Execution
- Use Task tool with multiple agents in SINGLE message for parallel execution
- Example: Launch Agent A and Agent B in one message with two Task calls

### Model Selection
- Haiku for scanning/analysis (cost-effective)
- Sonnet for test generation (better code quality)

### Quality Gates
- Every agent has success tests they MUST pass
- Do not mark agent complete until all tests pass
- Iterate as many times as needed to achieve success

---

## 📞 Handoff Complete

**You now have everything needed to execute Phase 5**. Follow the agent execution plan, launch agents in parallel groups, and ensure all success criteria are met.

**Estimated Wall Time**: 8-11 hours with parallelization
**Expected Outcome**: Production-ready testing foundation enabling rapid feature development

Good luck! 🚀
