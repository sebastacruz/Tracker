c# Session Handoff: Data Flow Refactoring

**Date**: January 11, 2026
**Task**: Fix broken statistics by refactoring the data model

---

## Prompt for New Session

Copy and paste this into a new Claude Code session:

---

**Task: Implement Phase 10 data flow refactoring for the Tracker app**

The app's statistics and metrics are broken. I've already analyzed the problem and created a plan in DEVLOG.md (Phase 10). Please read it and implement the fix.

**Summary of what's broken:**
- Entries store fake `initialMass` and `finalMass` values computed from `theoreticalInitialMass`
- Only the `delta` field contains real data (the actual dab size)
- Field names are confusing (`theoreticalInitialMass`, `totalInitialMass`, `finalMass`)

**The fix (already planned):**
1. Rename substance fields: `advertisedMass`, `grossInitialMass`, `grossFinalMass`
2. Simplify entries to only store `delta` (remove fake fields)
3. Add automatic migration for existing data
4. Update all calculations and UI to use new field names

**Files to modify:**
- src/utils/storage.js (migration)
- src/hooks/useSubstances.js (field renames)
- src/hooks/useEntries.js (simplify to delta-only)
- src/utils/calculations.js (update field references)
- src/components/QuickEntry.jsx (remove fake mass computation)
- src/components/SubstanceManager.jsx (form fields, labels)
- src/components/FinalMassDialog.jsx (update props)
- src/components/Dashboard.jsx (field references)
- src/components/History.jsx (remove fake columns)

**Start by:**
1. Reading DEVLOG.md Phase 10 for full context
2. Reading the plan file at ~/.claude/plans/quirky-drifting-squid.md
3. Implementing Phase 1 (storage migration) first

---

## Key Context

**User's workflow:**
1. Add flavor with advertised mass (product) + gross weight (jar + product on scale)
2. Record dabs by tapping size buttons (0.03g, 0.04g, 0.05g) - just the delta
3. Retire flavor by recording final gross weight (should ≈ container weight)

**Calculations should be:**
```javascript
remaining = advertisedMass - sum(deltas)
containerWeight = grossInitialMass - advertisedMass
actualUsed = grossInitialMass - grossFinalMass
```

**Files with full analysis:**
- [DEVLOG.md](DEVLOG.md) - Phase 10 section has complete plan
- [~/.claude/plans/quirky-drifting-squid.md](~/.claude/plans/quirky-drifting-squid.md) - Implementation details
