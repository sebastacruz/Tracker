/**
 * Seed data for initial setup
 * Contains sample data from the original spreadsheet
 */

const SEED_DATA = {
  substances: [
    {
      id: 'substance-apollo',
      name: 'Apollo',
      theoreticalInitialMass: 33.13,
      createdAt: '2026-01-01T00:00:00Z',
      active: true,
    },
    {
      id: 'substance-gramlin',
      name: 'Gramlin',
      theoreticalInitialMass: 45.68,
      createdAt: '2026-01-01T00:00:00Z',
      active: true,
    },
  ],
  entries: [
    {
      id: 'entry-1',
      substanceId: 'substance-apollo',
      person: 't',
      initialMass: 33.13,
      finalMass: 33.09,
      delta: 0.04,
      timestamp: '2026-01-01T12:30:00Z',
    },
    {
      id: 'entry-2',
      substanceId: 'substance-gramlin',
      person: 't',
      initialMass: 45.68,
      finalMass: 45.62,
      delta: 0.06,
      timestamp: '2026-01-01T13:30:00Z',
    },
    {
      id: 'entry-3',
      substanceId: 'substance-apollo',
      person: 't',
      initialMass: 33.09,
      finalMass: 33.06,
      delta: 0.03,
      timestamp: '2026-01-01T15:00:00Z',
    },
    {
      id: 'entry-4',
      substanceId: 'substance-apollo',
      person: 'e',
      initialMass: 33.06,
      finalMass: 33.02,
      delta: 0.04,
      timestamp: '2026-01-01T15:00:30Z',
    },
    {
      id: 'entry-5',
      substanceId: 'substance-gramlin',
      person: 't',
      initialMass: 45.64,
      finalMass: 45.59,
      delta: 0.05,
      timestamp: '2026-01-01T16:38:00Z',
    },
    {
      id: 'entry-6',
      substanceId: 'substance-gramlin',
      person: 't',
      initialMass: 45.61,
      finalMass: 45.57,
      delta: 0.04,
      timestamp: '2026-01-02T07:30:00Z',
    },
    {
      id: 'entry-7',
      substanceId: 'substance-apollo',
      person: 't',
      initialMass: 33.04,
      finalMass: 33.0,
      delta: 0.04,
      timestamp: '2026-01-02T09:30:00Z',
    },
    {
      id: 'entry-8',
      substanceId: 'substance-gramlin',
      person: 't',
      initialMass: 45.57,
      finalMass: 45.52,
      delta: 0.05,
      timestamp: '2026-01-02T11:00:00Z',
    },
    {
      id: 'entry-9',
      substanceId: 'substance-gramlin',
      person: 'e',
      initialMass: 45.52,
      finalMass: 45.42,
      delta: 0.1,
      timestamp: '2026-01-02T11:00:30Z',
    },
  ],
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
