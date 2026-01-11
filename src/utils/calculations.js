/**
 * Calculation utilities for substance tracking
 */

/**
 * Calculate mass delta (amount consumed)
 * @param {number} initialMass - Initial mass in grams
 * @param {number} finalMass - Final mass in grams
 * @returns {number} - Delta mass (initial - final) rounded to 2 decimals
 */
export function calculateDelta(initialMass, finalMass) {
  if (typeof initialMass !== 'number' || typeof finalMass !== 'number') {
    return 0;
  }
  return Number((initialMass - finalMass).toFixed(2));
}

/**
 * Calculate remaining mass for a substance
 * @param {number} theoreticalMass - Theoretical initial mass
 * @param {array} deltas - Array of usage deltas
 * @returns {number} - Remaining mass rounded to 2 decimals
 */
export function calculateRemaining(theoreticalMass, deltas = []) {
  if (typeof theoreticalMass !== 'number') {
    return 0;
  }
  const totalUsed = Array.isArray(deltas)
    ? deltas.reduce((sum, delta) => sum + (delta || 0), 0)
    : 0;
  return Number((theoreticalMass - totalUsed).toFixed(2));
}

/**
 * Get all deltas for a specific substance
 * @param {string} substanceId - Substance ID
 * @param {array} entries - Array of all entries
 * @returns {array} - Array of deltas for this substance
 */
export function getSubstancDeltas(substanceId, entries) {
  return entries
    .filter((entry) => entry.substanceId === substanceId)
    .map((entry) => entry.delta || 0);
}

/**
 * Get current remaining mass for a substance
 * @param {object} substance - Substance object
 * @param {array} entries - Array of all entries
 * @returns {number} - Current remaining mass
 */
export function getSubstanceRemaining(substance, entries) {
  const deltas = getSubstancDeltas(substance.id, entries);
  return calculateRemaining(substance.theoreticalInitialMass, deltas);
}

/**
 * Get total usage for a substance
 * @param {string} substanceId - Substance ID
 * @param {array} entries - Array of all entries
 * @returns {number} - Total mass used
 */
export function getTotalUsage(substanceId, entries) {
  return entries
    .filter((entry) => entry.substanceId === substanceId)
    .reduce((sum, entry) => sum + (entry.delta || 0), 0);
}

/**
 * Get actual mass used for a substance (using finalMass if available)
 * @param {object} substance - Substance object
 * @param {array} entries - Array of all entries
 * @returns {object} - { actualMassUsed, avgDabMass, usedFromEntries, hasFinalMass }
 */
export function getActualMassUsed(substance, entries) {
  const substanceEntries = entries.filter((e) => e.substanceId === substance.id);
  const usedFromEntries = substanceEntries.reduce((sum, e) => sum + (e.delta || 0), 0);

  const hasFinalMass = substance.finalMass !== null && substance.finalMass !== undefined;
  const actualMassUsed = hasFinalMass
    ? substance.theoreticalInitialMass - substance.finalMass
    : usedFromEntries;

  const avgDabMass = substanceEntries.length > 0 ? actualMassUsed / substanceEntries.length : 0;

  return {
    actualMassUsed: Number(actualMassUsed.toFixed(2)),
    avgDabMass: Number(avgDabMass.toFixed(4)),
    usedFromEntries: Number(usedFromEntries.toFixed(2)),
    hasFinalMass,
    sessionCount: substanceEntries.length,
  };
}

/**
 * Format mass value for display
 * @param {number} mass - Mass value
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted mass string
 */
export function formatMass(mass, decimals = 2) {
  return Number(mass).toFixed(decimals);
}

/**
 * Format timestamp for display
 * @param {string} timestamp - ISO timestamp
 * @returns {object} - { date: 'YYYY-MM-DD', time: 'HH:MM:SS' }
 */
export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return {
    date: date.toISOString().split('T')[0],
    time: date.toTimeString().split(' ')[0],
    full: date.toLocaleString(),
  };
}

/**
 * Get entries for a date range
 * @param {array} entries - All entries
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {array} - Filtered entries
 */
export function getEntriesByDateRange(entries, startDate, endDate) {
  return entries.filter((entry) => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= startDate && entryDate <= endDate;
  });
}

/**
 * Get entries for a specific substance
 * @param {array} entries - All entries
 * @param {string} substanceId - Substance ID
 * @returns {array} - Filtered entries
 */
export function getEntriesBySubstance(entries, substanceId) {
  return entries.filter((entry) => entry.substanceId === substanceId);
}

/**
 * Get entries for a specific person
 * @param {array} entries - All entries
 * @param {string} person - Person name
 * @returns {array} - Filtered entries
 */
export function getEntriesByPerson(entries, person) {
  return entries.filter((entry) => entry.person === person);
}

/**
 * Get unique people from entries
 * @param {array} entries - All entries
 * @returns {array} - Unique person names
 */
export function getUniquePeople(entries) {
  return [...new Set(entries.map((e) => e.person))].sort();
}

/**
 * Get usage statistics for a substance
 * @param {object} substance - Substance object
 * @param {array} entries - All entries
 * @returns {object} - Statistics object
 */
export function getSubstanceStats(substance, entries) {
  const substanceEntries = getEntriesBySubstance(entries, substance.id);
  const deltas = substanceEntries.map((e) => e.delta);
  const totalUsed = deltas.reduce((sum, d) => sum + d, 0);
  const remaining = getSubstanceRemaining(substance, entries);

  return {
    totalEntries: substanceEntries.length,
    totalUsed: Number(totalUsed.toFixed(2)),
    remaining: remaining,
    averageUsage:
      substanceEntries.length > 0 ? Number((totalUsed / substanceEntries.length).toFixed(2)) : 0,
    lastEntry: substanceEntries.length > 0 ? substanceEntries[substanceEntries.length - 1] : null,
  };
}

/**
 * Calculate usage rate (grams per day) for a substance
 * @param {object} substance - Substance object
 * @param {array} entries - All entries
 * @returns {number} - Usage rate in g/day (0 if insufficient data)
 */
export function getUsageRate(substance, entries) {
  const substanceEntries = getEntriesBySubstance(entries, substance.id);

  if (substanceEntries.length < 2) {
    return 0;
  }

  const sortedEntries = substanceEntries.sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  const firstEntry = new Date(sortedEntries[0].timestamp);
  const lastEntry = new Date(sortedEntries[sortedEntries.length - 1].timestamp);
  const daysDiff = (lastEntry - firstEntry) / (1000 * 60 * 60 * 24);

  if (daysDiff === 0) {
    return 0;
  }

  const totalUsed = substanceEntries.reduce((sum, e) => sum + e.delta, 0);
  return Number((totalUsed / daysDiff).toFixed(3));
}

/**
 * Calculate projected depletion date for a substance
 * @param {object} substance - Substance object
 * @param {array} entries - All entries
 * @returns {object} - { date: Date|null, daysRemaining: number|null, depleted: boolean }
 */
export function getProjectedDepletion(substance, entries) {
  const remaining = getSubstanceRemaining(substance, entries);
  const usageRate = getUsageRate(substance, entries);

  if (remaining <= 0) {
    return {
      date: null,
      daysRemaining: 0,
      depleted: true,
    };
  }

  if (usageRate === 0 || entries.length < 2) {
    return {
      date: null,
      daysRemaining: null,
      depleted: false,
    };
  }

  const daysRemaining = Math.ceil(remaining / usageRate);
  const depletionDate = new Date();
  depletionDate.setDate(depletionDate.getDate() + daysRemaining);

  return {
    date: depletionDate,
    daysRemaining: daysRemaining,
    depleted: false,
  };
}

/**
 * Get entries filtered by person
 * @param {array} entries - All entries
 * @param {string} person - Person identifier
 * @returns {array} - Filtered and sorted entries
 */
export function getPersonEntries(entries, person) {
  return entries
    .filter((e) => e.person === person)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

/**
 * Get overall usage statistics for a person
 * @param {array} entries - All entries
 * @param {string} person - Person identifier
 * @returns {object} - Overall stats { totalMass, totalSessions, dateRange, massPerDay, sessionsPerDay }
 */
export function getOverallStats(entries, person) {
  const personEntries = getPersonEntries(entries, person);

  if (personEntries.length === 0) {
    return {
      totalMass: 0,
      totalSessions: 0,
      dateRange: { first: null, last: null, days: 0 },
      massPerDay: 0,
      sessionsPerDay: 0,
    };
  }

  const totalMass = personEntries.reduce((sum, e) => sum + e.delta, 0);
  const totalSessions = personEntries.length;

  const firstEntry = new Date(personEntries[0].timestamp);
  const lastEntry = new Date(personEntries[personEntries.length - 1].timestamp);
  const daysDiff = Math.max(1, (lastEntry - firstEntry) / (1000 * 60 * 60 * 24));

  return {
    totalMass: Number(totalMass.toFixed(2)),
    totalSessions,
    dateRange: {
      first: firstEntry,
      last: lastEntry,
      days: Math.ceil(daysDiff),
    },
    massPerDay: Number((totalMass / daysDiff).toFixed(2)),
    sessionsPerDay: Number((totalSessions / daysDiff).toFixed(1)),
  };
}

/**
 * Get per-substance usage statistics for a person
 * @param {array} entries - All entries
 * @param {string} person - Person identifier
 * @param {array} substances - All substances
 * @returns {array} - Array of substance stats
 */
export function getPerSubstanceStats(entries, person, substances, includeInactive = false) {
  const personEntries = getPersonEntries(entries, person);

  return substances
    .filter((s) => includeInactive || s.active)
    .map((substance) => {
      const substanceEntries = personEntries.filter((e) => e.substanceId === substance.id);

      if (substanceEntries.length === 0) {
        return {
          substance,
          totalMass: 0,
          sessions: 0,
          massPerDay: 0,
          sessionsPerDay: 0,
          actualMassUsed: 0,
          avgDabMass: 0,
        };
      }

      const totalMass = substanceEntries.reduce((sum, e) => sum + e.delta, 0);
      const firstEntry = new Date(substanceEntries[0].timestamp);
      const lastEntry = new Date(substanceEntries[substanceEntries.length - 1].timestamp);
      const daysDiff = Math.max(1, (lastEntry - firstEntry) / (1000 * 60 * 60 * 24));

      const actualStats = getActualMassUsed(substance, entries);

      return {
        substance,
        totalMass: Number(totalMass.toFixed(2)),
        sessions: substanceEntries.length,
        massPerDay: Number((totalMass / daysDiff).toFixed(2)),
        sessionsPerDay: Number((substanceEntries.length / daysDiff).toFixed(1)),
        actualMassUsed: actualStats.actualMassUsed,
        avgDabMass: actualStats.avgDabMass,
      };
    })
    .sort((a, b) => b.totalMass - a.totalMass);
}

/**
 * Get weekly comparison for a person (current week vs previous week)
 * @param {array} entries - All entries
 * @param {string} person - Person identifier
 * @returns {object} - Weekly comparison { current, previous, change }
 */
export function getWeeklyComparison(entries, person) {
  const personEntries = getPersonEntries(entries, person);

  const now = new Date();
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - now.getDay());
  currentWeekStart.setHours(0, 0, 0, 0);

  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(currentWeekStart.getDate() - 7);

  const currentWeekEntries = personEntries.filter((e) => {
    const entryDate = new Date(e.timestamp);
    return entryDate >= currentWeekStart;
  });

  const previousWeekEntries = personEntries.filter((e) => {
    const entryDate = new Date(e.timestamp);
    return entryDate >= previousWeekStart && entryDate < currentWeekStart;
  });

  const currentMass = currentWeekEntries.reduce((sum, e) => sum + e.delta, 0);
  const previousMass = previousWeekEntries.reduce((sum, e) => sum + e.delta, 0);

  const massChange = previousMass > 0 ? ((currentMass - previousMass) / previousMass) * 100 : 0;

  const sessionsChange =
    previousWeekEntries.length > 0
      ? ((currentWeekEntries.length - previousWeekEntries.length) / previousWeekEntries.length) *
        100
      : 0;

  return {
    current: {
      mass: Number(currentMass.toFixed(2)),
      sessions: currentWeekEntries.length,
      dateRange: { start: currentWeekStart, end: now },
    },
    previous: {
      mass: Number(previousMass.toFixed(2)),
      sessions: previousWeekEntries.length,
      dateRange: { start: previousWeekStart, end: currentWeekStart },
    },
    change: {
      mass: Number(massChange.toFixed(1)),
      sessions: Number(sessionsChange.toFixed(1)),
    },
  };
}

/**
 * Get usage breakdown by day of week for a person
 * @param {array} entries - All entries
 * @param {string} person - Person identifier
 * @returns {array} - Array of 7 objects (Mon-Sun) with avg mass and sessions
 */
export function getDayOfWeekBreakdown(entries, person) {
  const personEntries = getPersonEntries(entries, person);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayData = Array(7)
    .fill(null)
    .map((_, i) => ({
      day: dayNames[i],
      totalMass: 0,
      totalSessions: 0,
      occurrences: 0,
    }));

  personEntries.forEach((entry) => {
    const dayOfWeek = new Date(entry.timestamp).getDay();
    dayData[dayOfWeek].totalMass += entry.delta;
    dayData[dayOfWeek].totalSessions += 1;
    dayData[dayOfWeek].occurrences += 1;
  });

  return dayData.map((d) => ({
    day: d.day,
    avgMass: d.occurrences > 0 ? Number((d.totalMass / d.occurrences).toFixed(2)) : 0,
    avgSessions: d.occurrences > 0 ? Number((d.totalSessions / d.occurrences).toFixed(1)) : 0,
  }));
}

/**
 * Get mass distribution for a substance (t, e, remaining)
 * @param {object} substance - Substance object
 * @param {array} entries - All entries
 * @returns {array} - Array of 3 objects for pie chart segments
 */
export function getSubstanceMassDistribution(substance, entries) {
  const substanceEntries = entries.filter((e) => e.substanceId === substance.id);

  const tMass = substanceEntries
    .filter((e) => e.person === 't')
    .reduce((sum, e) => sum + e.delta, 0);

  const eMass = substanceEntries
    .filter((e) => e.person === 'e')
    .reduce((sum, e) => sum + e.delta, 0);

  const totalUsed = tMass + eMass;
  const remaining = Math.max(0, substance.theoreticalInitialMass - totalUsed);

  return [
    { name: 't', value: Number(tMass.toFixed(2)), fill: '#2E6F40' },
    { name: 'e', value: Number(eMass.toFixed(2)), fill: '#3b82f6' },
    { name: 'Remaining', value: Number(remaining.toFixed(2)), fill: '#475569' },
  ];
}
