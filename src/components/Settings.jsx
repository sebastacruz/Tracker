/**
 * Settings component - Export, import, and data management
 */
import { useEntries } from '../hooks/useEntries';
import { useSubstances } from '../hooks/useSubstances';
import {
  exportAsJSON,
  exportAsCSV,
  clearAllData,
  importFromJSON,
  saveData,
} from '../utils/storage';
import { useState } from 'react';

export default function Settings() {
  const { substances } = useSubstances();
  const { entries } = useEntries();
  const [exportSuccess, setExportSuccess] = useState('');
  const [importMessage, setImportMessage] = useState({ type: '', text: '' });

  const handleExportJSON = () => {
    const data = {
      substances,
      entries,
      metadata: {
        version: '1.0',
        exportedAt: new Date().toISOString(),
      },
    };
    exportAsJSON(data);
    setExportSuccess('JSON exported!');
    setTimeout(() => setExportSuccess(''), 3000);
  };

  const handleExportCSV = () => {
    exportAsCSV(entries, substances);
    setExportSuccess('CSV exported!');
    setTimeout(() => setExportSuccess(''), 3000);
  };

  const handleClearData = () => {
    clearAllData();
  };

  const handleImportJSON = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedData = await importFromJSON(file);

      // Validate the imported data structure
      if (!importedData.substances || !importedData.entries) {
        throw new Error('Invalid backup file format');
      }

      // Save the imported data to localStorage
      saveData(importedData);

      // Show success message
      setImportMessage({ type: 'success', text: 'Data imported successfully! Reloading...' });

      // Reload the page after a short delay to refresh all state
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setImportMessage({
        type: 'error',
        text: `Import failed: ${error.message}`,
      });
      setTimeout(() => setImportMessage({ type: '', text: '' }), 5000);
    }

    // Reset file input
    event.target.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Settings</h2>
        <p className="text-slate-400">Export data & app configuration</p>
      </div>

      {/* Success Message */}
      {exportSuccess && (
        <div className="mb-4 p-4 bg-emerald-950/50 border border-emerald-700 rounded-lg text-emerald-200">
          {exportSuccess}
        </div>
      )}

      {/* Import Message */}
      {importMessage.text && (
        <div
          className={`mb-4 p-4 rounded-lg border ${
            importMessage.type === 'success'
              ? 'bg-emerald-950/50 border-emerald-700 text-emerald-200'
              : 'bg-red-950/50 border-red-700 text-red-200'
          }`}
        >
          {importMessage.text}
        </div>
      )}

      {/* Data Import Section */}
      <div className="card mb-6">
        <h3 className="text-lg font-bold mb-4">Import Data</h3>
        <p className="text-slate-400 text-sm mb-4">Restore your data from a backup JSON file.</p>

        <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="font-semibold mb-1">Import from JSON Backup</h4>
              <p className="text-sm text-slate-400">
                Select a JSON backup file to restore all your substances and entries.
              </p>
            </div>
            <div>
              <label className="btn-primary cursor-pointer inline-block">
                Choose Backup File
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-amber-950/50 border border-amber-700 rounded-lg text-amber-200 text-sm">
          ⚠️ Warning: Importing will replace all existing data. Make sure to export your current
          data first if you want to keep it!
        </div>
      </div>

      {/* Data Export Section */}
      <div className="card mb-6">
        <h3 className="text-lg font-bold mb-4">Export Data</h3>
        <p className="text-slate-400 text-sm mb-4">
          Download your data for backup, analysis, or import into other tools.
        </p>

        <div className="space-y-3">
          {/* Export as JSON */}
          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-semibold mb-1">Export as JSON</h4>
                <p className="text-sm text-slate-400">
                  Complete data backup including all substances and entries. Use this to import data
                  elsewhere or keep as backup.
                </p>
              </div>
              <button onClick={handleExportJSON} className="btn-primary whitespace-nowrap">
                Download JSON
              </button>
            </div>
          </div>

          {/* Export as CSV */}
          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-semibold mb-1">Export as CSV</h4>
                <p className="text-sm text-slate-400">
                  Entries in spreadsheet format. Perfect for analysis in Excel, Google Sheets, or
                  your analytics tools.
                </p>
              </div>
              <button onClick={handleExportCSV} className="btn-primary whitespace-nowrap">
                Download CSV
              </button>
            </div>
          </div>
        </div>

        {/* Data Stats */}
        <div className="mt-6 pt-6 border-t border-slate-700">
          <h4 className="font-semibold mb-3">Data Summary</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-900 rounded-lg">
              <p className="text-slate-400 text-sm">Active Substances</p>
              <p className="text-2xl font-bold">{substances.filter((s) => s.active).length}</p>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg">
              <p className="text-slate-400 text-sm">Total Entries</p>
              <p className="text-2xl font-bold">{entries.length}</p>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg">
              <p className="text-slate-400 text-sm">Total Usage</p>
              <p className="text-2xl font-bold">
                {entries.reduce((sum, e) => sum + e.delta, 0).toFixed(2)}g
              </p>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg">
              <p className="text-slate-400 text-sm">People Tracked</p>
              <p className="text-2xl font-bold">{new Set(entries.map((e) => e.person)).size}</p>
            </div>
          </div>
        </div>
      </div>

      {/* iCloud Setup Guide */}
      <div className="card mb-6">
        <h3 className="text-lg font-bold mb-4">Sync to iCloud (Optional)</h3>
        <p className="text-slate-400 text-sm mb-4">
          Keep your exported JSON file in your iCloud Files folder so you can access it from your
          Mac for analytics and backup.
        </p>

        <div className="space-y-3 text-sm text-slate-300">
          <ol className="list-decimal list-inside space-y-2">
            <li>Export your data as JSON (button above)</li>
            <li>Open the Files app on your iPhone</li>
            <li>Go to iCloud Drive (or any synced location)</li>
            <li>Upload the tracker JSON file there</li>
            <li>On your Mac, it will appear in iCloud Drive</li>
            <li>You can now analyze the JSON with your own tools</li>
          </ol>
        </div>

        <div className="mt-4 p-3 bg-emerald-950/50 border border-emerald-700 rounded-lg text-emerald-200 text-sm">
          The exported JSON stays in sync with your latest entries once you export it. Re-export
          periodically to update the file.
        </div>
      </div>

      {/* Data Management Section */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4">Data Management</h3>
        <p className="text-slate-400 text-sm mb-4">
          Manage your app data. Be careful with destructive actions!
        </p>

        <button onClick={handleClearData} className="btn-danger w-full">
          Clear All Data
        </button>

        <p className="text-xs text-red-400 mt-3">
          ⚠️ Warning: This will permanently delete all substances and entries. Make sure you&apos;ve
          exported your data first!
        </p>
      </div>

      {/* FAQ */}
      <div className="mt-8 card">
        <h3 className="text-lg font-bold mb-4">Frequently Asked Questions</h3>

        <div className="space-y-4 text-sm text-slate-300">
          <div>
            <h4 className="font-semibold mb-2">Where does my data live?</h4>
            <p className="text-slate-400">
              Data is stored in your browser&apos;s localStorage on your phone. When you export, it
              creates a file that you control.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">How do I back up my data?</h4>
            <p className="text-slate-400">
              Click &ldquo;Download JSON&rdquo; to save your complete data. Store it safely, or
              upload it to iCloud Drive.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Can I analyze my data externally?</h4>
            <p className="text-slate-400">
              Yes! Export as CSV for spreadsheets, or as JSON for programmatic analysis with Python,
              R, etc.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">How do I restore my data from a backup?</h4>
            <p className="text-slate-400">
              Use the &ldquo;Choose Backup File&rdquo; button above to select your JSON backup file.
              The app will restore all your substances and entries automatically.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">What if I lose my phone?</h4>
            <p className="text-slate-400">
              Your exported JSON files in iCloud Drive persist. Reinstall the app, import your
              backup, and you&apos;re back in business!
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">How often should I export?</h4>
            <p className="text-slate-400">
              Export after each week of tracking, or whenever you want a backup. It only takes
              seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
