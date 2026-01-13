/**
 * Storage utilities for managing app data
 * Handles localStorage and JSON export/import
 */

const STORAGE_KEY = 'tracker_data';

/**
 * Default data structure
 */
const defaultData = {
  substances: [],
  entries: [],
  metadata: {
    version: '2.0',
    lastUpdated: new Date().toISOString(),
  },
};

/**
 * Convert UTC timestamp to local time format
 * @param {string} timestamp - UTC timestamp (e.g., "2026-01-13T10:30:00.000Z")
 * @returns {string} - Local time timestamp (e.g., "2026-01-13T02:30:00")
 */
function convertUTCToLocal(timestamp) {
  // If timestamp doesn't end with Z, it's already in local format
  if (!timestamp.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(timestamp)) {
    return timestamp;
  }

  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

/**
 * Migrate timestamps from UTC to local time format
 * @param {object} data - Data with UTC timestamps
 * @returns {object} - Data with local timestamps
 */
function migrateTimestamps(data) {
  const migratedSubstances = data.substances.map((substance) => ({
    ...substance,
    createdAt: convertUTCToLocal(substance.createdAt),
  }));

  const migratedEntries = data.entries.map((entry) => ({
    ...entry,
    timestamp: convertUTCToLocal(entry.timestamp),
  }));

  return {
    ...data,
    substances: migratedSubstances,
    entries: migratedEntries,
  };
}

/**
 * Migrate data from v1.0 to v2.0 schema
 * Changes:
 * - Substances: theoreticalInitialMass → advertisedMass
 * - Substances: totalInitialMass → grossInitialMass
 * - Substances: finalMass → grossFinalMass
 * - Entries: Remove initialMass/finalMass (keep only delta)
 * @param {object} data - Old format data
 * @returns {object} - Migrated data
 */
function migrateToV2(data) {
  console.log('Migrating data from v1.0 to v2.0...');

  const migratedSubstances = data.substances.map((substance) => {
    const migrated = {
      id: substance.id,
      name: substance.name,
      advertisedMass: substance.theoreticalInitialMass || substance.advertisedMass || 1.0,
      grossInitialMass: substance.totalInitialMass || substance.grossInitialMass || null,
      grossFinalMass:
        substance.finalMass !== undefined
          ? substance.finalMass
          : substance.grossFinalMass !== undefined
            ? substance.grossFinalMass
            : null,
      active: substance.active !== undefined ? substance.active : true,
      createdAt: substance.createdAt || new Date().toISOString(),
    };

    // Remove old fields
    delete migrated.theoreticalInitialMass;
    delete migrated.totalInitialMass;
    delete migrated.finalMass;

    return migrated;
  });

  const migratedEntries = data.entries.map((entry) => {
    const migrated = {
      id: entry.id,
      substanceId: entry.substanceId,
      person: entry.person,
      delta: entry.delta,
      timestamp: entry.timestamp,
    };

    // Include notes if present
    if (entry.notes) {
      migrated.notes = entry.notes;
    }

    return migrated;
  });

  console.log(
    `Migrated ${migratedSubstances.length} substances and ${migratedEntries.length} entries`
  );

  return {
    substances: migratedSubstances,
    entries: migratedEntries,
    metadata: {
      version: '2.0',
      lastUpdated: new Date().toISOString(),
    },
  };
}

/**
 * Get all data from localStorage
 * Automatically migrates from v1.0 to v2.0 if needed
 * @returns {object} - Complete tracker data
 */
export function getData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultData;
    }

    let data = JSON.parse(stored);

    // Auto-migrate if old schema detected
    const needsMigration =
      !data.metadata?.version ||
      data.metadata.version === '1.0' ||
      (data.substances &&
        data.substances.length > 0 &&
        data.substances[0].theoreticalInitialMass !== undefined);

    if (needsMigration) {
      data = migrateToV2(data);
    }

    // Migrate UTC timestamps to local time
    const needsTimestampMigration =
      data.entries &&
      data.entries.length > 0 &&
      (data.entries[0].timestamp.endsWith('Z') ||
        /[+-]\d{2}:\d{2}$/.test(data.entries[0].timestamp));

    if (needsTimestampMigration) {
      console.log('Converting UTC timestamps to local time...');
      data = migrateTimestamps(data);
    }

    // Save migrated data if any migration occurred
    if (needsMigration || needsTimestampMigration) {
      saveData(data);
    }

    return data;
  } catch (error) {
    console.error('Error reading data from localStorage:', error);
    return defaultData;
  }
}

/**
 * Save data to localStorage
 * @param {object} data - Complete tracker data
 */
export function saveData(data) {
  try {
    const updatedData = {
      ...data,
      metadata: {
        ...data.metadata,
        lastUpdated: new Date().toISOString(),
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
}

/**
 * Export data as JSON file
 * @param {object} data - Data to export
 * @returns {void} - Triggers download
 */
export function exportAsJSON(data) {
  try {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tracker-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting JSON:', error);
  }
}

/**
 * Export data as CSV file
 * @param {array} entries - Array of entry objects
 * @param {array} substances - Array of substance objects
 * @returns {void} - Triggers download
 */
export function exportAsCSV(entries, substances) {
  try {
    // Create substance lookup
    const substanceLookup = substances.reduce((acc, sub) => {
      acc[sub.id] = sub.name;
      return acc;
    }, {});

    // CSV headers - removed fake initialMass/finalMass columns
    const headers = ['Date', 'Time', 'Substance', 'Person', 'Delta (g)'];

    // CSV rows
    const rows = entries.map((entry) => {
      const date = new Date(entry.timestamp);
      return [
        date.toISOString().split('T')[0],
        date.toTimeString().split(' ')[0],
        substanceLookup[entry.substanceId] || 'Unknown',
        entry.person,
        entry.delta,
      ];
    });

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Download
    const csvBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tracker-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting CSV:', error);
  }
}

/**
 * Import data from JSON file
 * Automatically migrates old format data to v2.0
 * @param {File} file - JSON file to import
 * @returns {Promise<object>} - Imported data (migrated if needed)
 */
export async function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let data = JSON.parse(e.target.result);

        // Auto-migrate if old schema detected
        const needsMigration =
          !data.metadata?.version ||
          data.metadata.version === '1.0' ||
          (data.substances &&
            data.substances.length > 0 &&
            data.substances[0].theoreticalInitialMass !== undefined);

        if (needsMigration) {
          console.log('Migrating imported data...');
          data = migrateToV2(data);
        }

        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Clear all data
 * @returns {void}
 */
export function clearAllData() {
  if (window.confirm('Are you sure you want to delete all data? This cannot be undone.')) {
    localStorage.removeItem(STORAGE_KEY);
  }
}
