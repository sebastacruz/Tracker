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
    .filter(entry => entry.substanceId === substanceId)
    .map(entry => entry.delta || 0);
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
    .filter(entry => entry.substanceId === substanceId)
    .reduce((sum, entry) => sum + (entry.delta || 0), 0);
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
  return entries.filter(entry => {
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
  return entries.filter(entry => entry.substanceId === substanceId);
}

/**
 * Get entries for a specific person
 * @param {array} entries - All entries
 * @param {string} person - Person name
 * @returns {array} - Filtered entries
 */
export function getEntriesByPerson(entries, person) {
  return entries.filter(entry => entry.person === person);
}

/**
 * Get unique people from entries
 * @param {array} entries - All entries
 * @returns {array} - Unique person names
 */
export function getUniquePeople(entries) {
  return [...new Set(entries.map(e => e.person))].sort();
}

/**
 * Get usage statistics for a substance
 * @param {object} substance - Substance object
 * @param {array} entries - All entries
 * @returns {object} - Statistics object
 */
export function getSubstanceStats(substance, entries) {
  const substanceEntries = getEntriesBySubstance(entries, substance.id);
  const deltas = substanceEntries.map(e => e.delta);
  const totalUsed = deltas.reduce((sum, d) => sum + d, 0);
  const remaining = getSubstanceRemaining(substance, entries);

  return {
    totalEntries: substanceEntries.length,
    totalUsed: Number(totalUsed.toFixed(2)),
    remaining: remaining,
    averageUsage: substanceEntries.length > 0
      ? Number((totalUsed / substanceEntries.length).toFixed(2))
      : 0,
    lastEntry: substanceEntries.length > 0
      ? substanceEntries[substanceEntries.length - 1]
      : null,
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

  const sortedEntries = substanceEntries.sort((a, b) =>
    new Date(a.timestamp) - new Date(b.timestamp)
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
