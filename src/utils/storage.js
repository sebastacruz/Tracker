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
    version: '1.0',
    lastUpdated: new Date().toISOString(),
  },
};

/**
 * Get all data from localStorage
 * @returns {object} - Complete tracker data
 */
export function getData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultData;
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

    // CSV headers
    const headers = [
      'Date',
      'Time',
      'Substance',
      'Person',
      'Initial Mass (g)',
      'Final Mass (g)',
      'Delta (g)',
    ];

    // CSV rows
    const rows = entries.map(entry => {
      const date = new Date(entry.timestamp);
      return [
        date.toISOString().split('T')[0],
        date.toTimeString().split(' ')[0],
        substanceLookup[entry.substanceId] || 'Unknown',
        entry.person,
        entry.initialMass,
        entry.finalMass,
        entry.delta,
      ];
    });

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row =>
        row.map(cell => `"${cell}"`).join(',')
      ),
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
 * @param {File} file - JSON file to import
 * @returns {Promise<object>} - Imported data
 */
export async function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
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
