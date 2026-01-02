/**
 * Seed data for initial setup
 *
 * Default Configuration:
 * - Two initial substances: Apollo and Gramlin
 * - Both substances default to 1g theoretical initial mass
 * - New substances added by users will default to 1g (editable before saving)
 * - Mass values include the container weight
 */

const SEED_DATA = {
  substances: [
    {
      id: 'substance-apollo',
      name: 'Apollo',
      theoreticalInitialMass: 1,
      createdAt: '2026-01-01T00:00:00Z',
      active: true,
    },
    {
      id: 'substance-gramlin',
      name: 'Gramlin',
      theoreticalInitialMass: 1,
      createdAt: '2026-01-01T00:00:00Z',
      active: true,
    },
  ],
  entries: [],
  metadata: {
    version: '1.0',
    lastUpdated: new Date().toISOString(),
  },
};

/**
 * Initialize app with seed data if localStorage is empty
 */
export function initializeSeedData() {
  const STORAGE_KEY = 'tracker_data';
  const existingData = localStorage.getItem(STORAGE_KEY);

  // Only load seed data if no data exists
  if (!existingData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    console.log('✅ Seed data loaded successfully');
    return true;
  }

  return false;
}


/**
 * Export seed data for reference
 */
export function getSeedData() {
  return SEED_DATA;
}
