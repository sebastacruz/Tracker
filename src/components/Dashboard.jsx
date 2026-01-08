/**
 * Dashboard component - Visual analytics with charts
 */
import { useState, useMemo, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getSubstanceRemaining, formatTimestamp } from '../utils/calculations';

const COLORS = [
  '#2E6F40',
  '#358D47',
  '#6B8E6B',
  '#10b981',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#f97316',
];

export default function Dashboard({ substances, entries }) {
  const [selectedSubstances, setSelectedSubstances] = useState(() => {
    const activeSubstances = substances.filter((s) => s.active);
    return activeSubstances.length > 0 ? [activeSubstances[0].id] : [];
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  // Update selectedSubstances when substances change
  useEffect(() => {
    const activeSubstances = substances.filter((s) => s.active);
    if (activeSubstances.length > 0 && selectedSubstances.length === 0) {
      setSelectedSubstances([activeSubstances[0].id]);
    }
  }, [substances]);

  // Get substance lookup
  const substanceLookup = useMemo(() => {
    return substances.reduce((acc, s) => {
      acc[s.id] = s;
      return acc;
    }, {});
  }, [substances]);

  // Chart 1: Remaining mass over time for selected substances
  const remainingOverTimeData = useMemo(() => {
    if (selectedSubstances.length === 0) return [];

    // Get all entries and sort by timestamp
    const allEntries = entries
      .filter((e) => selectedSubstances.includes(e.substanceId))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (allEntries.length === 0) return [];

    // Group by timestamp and substance to calculate remaining
    const timeMap = {};
    const substanceRunning = {};

    // Initialize running totals
    selectedSubstances.forEach((id) => {
      substanceRunning[id] = 0;
    });

    allEntries.forEach((entry) => {
      substanceRunning[entry.substanceId] += entry.delta;
      const time = formatTimestamp(entry.timestamp);
      const key = `${time.date} ${time.time}`;

      if (!timeMap[key]) {
        timeMap[key] = { date: time.date, time: time.time, timestamp: entry.timestamp };
      }

      const substance = substanceLookup[entry.substanceId];
      if (substance) {
        const remaining = substance.theoreticalInitialMass - substanceRunning[entry.substanceId];
        timeMap[key][`${substance.name}`] = Number(remaining.toFixed(2));
      }
    });

    // Convert to array and sort by timestamp
    return Object.values(timeMap).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [selectedSubstances, entries, substanceLookup]);

  if (substances.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="card text-center py-12">
          <p className="text-slate-400 text-lg">No data to display</p>
          <p className="text-slate-500 text-sm mt-2">Add substances and entries to see charts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 relative overflow-y-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-slate-400">Visual analytics and trends</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600
                     text-white rounded-lg transition-colors flex items-center gap-2"
          aria-label="Refresh dashboard"
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

      {/* Flavor Selector - Button Grid */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <label className="label-base">Select Flavors</label>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setSelectedSubstances(substances.filter((s) => s.active).map((s) => s.id))
              }
              className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
            >
              Select All
            </button>
            <button
              onClick={() => setSelectedSubstances([])}
              className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {substances
            .filter((s) => s.active)
            .map((substance) => {
              const isSelected = selectedSubstances.includes(substance.id);
              return (
                <button
                  key={substance.id}
                  type="button"
                  onClick={() => {
                    setSelectedSubstances((prev) =>
                      isSelected
                        ? prev.filter((id) => id !== substance.id)
                        : [...prev, substance.id]
                    );
                  }}
                  className={`px-4 py-3 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                      : 'border-slate-700 bg-slate-800 hover:border-slate-600 text-slate-300'
                  }`}
                >
                  {substance.name}
                </button>
              );
            })}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        {/* Remaining Over Time */}
        {remainingOverTimeData.length > 0 ? (
          <div className="card col-span-full md:col-span-1">
            <h3 className="text-lg font-bold mb-4">Remaining Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={remainingOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #303030',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                {selectedSubstances.map((substanceId, index) => {
                  const substance = substanceLookup[substanceId];
                  return (
                    <Line
                      key={substanceId}
                      type="monotone"
                      dataKey={substance?.name}
                      stroke={COLORS[index % COLORS.length]}
                      name={`${substance?.name} (g)`}
                      dot={{ fill: COLORS[index % COLORS.length], r: 3 }}
                      activeDot={{ r: 5 }}
                      strokeWidth={2}
                      connectNulls={true}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="card col-span-full md:col-span-1 flex items-center justify-center py-12">
            <p className="text-slate-400">No entries yet for selected substances</p>
          </div>
        )}
      </div>
    </div>
  );
}
