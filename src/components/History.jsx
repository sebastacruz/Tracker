/**
 * History component - View all entries in a table
 */
import { useState } from 'react';
import { useEntries } from '../hooks/useEntries';
import { formatTimestamp } from '../utils/calculations';

export default function History({ substances, entries }) {
  const { deleteEntry } = useEntries();
  const [selectedSubstance, setSelectedSubstance] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  // Create lookup
  const substanceLookup = substances.reduce((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {});

  // Filter entries
  let filtered = entries;
  if (selectedSubstance) {
    filtered = filtered.filter((e) => e.substanceId === selectedSubstance);
  }
  if (selectedPerson) {
    filtered = filtered.filter((e) => e.person === selectedPerson);
  }

  // Get unique people
  const uniquePeople = [...new Set(entries.map((e) => e.person))].sort();

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 relative overflow-y-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">History</h2>
          <p className="text-slate-400">View all recorded entries</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600
                     text-white rounded-lg transition-colors flex items-center gap-2"
          aria-label="Refresh history"
        >
          <svg
            className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="label-base">Filter by Flavor</label>
          <select
            value={selectedSubstance}
            onChange={(e) => setSelectedSubstance(e.target.value)}
            className="input-base w-full"
          >
            <option value="">All flavors</option>
            {substances.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-base">Filter by Person</label>
          <select
            value={selectedPerson}
            onChange={(e) => setSelectedPerson(e.target.value)}
            className="input-base w-full"
          >
            <option value="">All people</option>
            {uniquePeople.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-slate-400">
        Showing {filtered.length} of {entries.length} entries
      </div>

      {/* Table or Empty State */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-slate-400 text-lg">No entries found</p>
          <p className="text-slate-500 text-sm mt-2">
            {entries.length === 0
              ? 'Start by recording your first entry in Quick Entry'
              : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 font-semibold text-slate-300">Date/Time</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-300">Flavor</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-300">Person</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-300">Initial (g)</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-300">Final (g)</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-300">Delta (g)</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => {
                const substance = substanceLookup[entry.substanceId];
                const time = formatTimestamp(entry.timestamp);
                return (
                  <>
                    <tr
                      key={entry.id}
                      className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-slate-400 text-xs font-mono">
                        <div>{time.date}</div>
                        <div className="text-slate-500">{time.time}</div>
                      </td>
                      <td className="py-3 px-4 font-medium">{substance?.name || 'Unknown'}</td>
                      <td className="py-3 px-4">{entry.person}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-300">
                        {entry.initialMass}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-300">
                        {entry.finalMass}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                        {entry.delta}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-400 hover:text-red-300 font-medium text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {entry.notes && (
                      <tr
                        key={`${entry.id}-notes`}
                        className="border-b border-slate-800 bg-slate-900/30"
                      >
                        <td colSpan="7" className="py-2 px-4 text-xs text-slate-400 italic">
                          <span className="text-slate-500">Note:</span> {entry.notes}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Statistics */}
      {filtered.length > 0 && (
        <div className="mt-8 card">
          <h3 className="text-lg font-bold mb-4">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-slate-400 text-sm">Total Entries</p>
              <p className="text-2xl font-bold">{filtered.length}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Usage</p>
              <p className="text-2xl font-bold">
                {filtered.reduce((sum, e) => sum + e.delta, 0).toFixed(2)}g
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Average Usage</p>
              <p className="text-2xl font-bold">
                {(filtered.reduce((sum, e) => sum + e.delta, 0) / filtered.length).toFixed(2)}g
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">People Involved</p>
              <p className="text-2xl font-bold">{new Set(filtered.map((e) => e.person)).size}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
