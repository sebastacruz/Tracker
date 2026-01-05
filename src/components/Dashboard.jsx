/**
 * Dashboard component - Visual analytics with charts
 */
import { useState, useMemo, useRef, useEffect } from 'react';
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
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Update selectedSubstances when substances change
  useEffect(() => {
    const activeSubstances = substances.filter((s) => s.active);
    if (activeSubstances.length > 0 && selectedSubstances.length === 0) {
      setSelectedSubstances([activeSubstances[0].id]);
    }
  }, [substances]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const toggleSubstance = (substanceId) => {
    setSelectedSubstances((prev) => {
      if (prev.includes(substanceId)) {
        return prev.filter((id) => id !== substanceId);
      } else {
        return [...prev, substanceId];
      }
    });
  };

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

  // Chart 2: Usage by person (for selected substances)
  const usageByPersonData = useMemo(() => {
    if (selectedSubstances.length === 0) return [];

    const substanceEntries = entries.filter((e) => selectedSubstances.includes(e.substanceId));

    const personMap = {};
    substanceEntries.forEach((entry) => {
      if (!personMap[entry.person]) {
        personMap[entry.person] = 0;
      }
      personMap[entry.person] += entry.delta;
    });

    return Object.entries(personMap)
      .map(([person, usage]) => ({
        name: person,
        usage: Number(usage.toFixed(2)),
      }))
      .sort((a, b) => b.usage - a.usage);
  }, [selectedSubstances, entries]);

  // Chart 3: All substances remaining
  const allSubstancesData = useMemo(() => {
    return substances
      .filter((s) => s.active)
      .map((substance) => {
        const remaining = getSubstanceRemaining(substance, entries);
        return {
          name: substance.name,
          remaining: remaining,
          theoretical: substance.theoreticalInitialMass,
          used: substance.theoreticalInitialMass - remaining,
        };
      });
  }, [substances, entries]);

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
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-slate-400">Visual analytics and trends</p>
      </div>

      {/* Flavor Selector - Multi-select */}
      <div ref={menuRef} className="card mb-6 max-w-md relative">
        <label className="label-base">Select Flavors</label>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="input-base w-full text-left flex justify-between items-center cursor-pointer"
        >
          <span className="truncate">
            {selectedSubstances.length === 0
              ? 'No flavors selected'
              : selectedSubstances.length === 1
                ? substances.find((s) => s.id === selectedSubstances[0])?.name
                : `${selectedSubstances.length} flavors selected`}
          </span>
          <span className="text-slate-400">{showMenu ? '▲' : '▼'}</span>
        </button>

        {showMenu && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-secondary border border-slate-700 rounded-xl z-50 max-h-64 overflow-y-auto shadow-xl">
            {substances
              .filter((s) => s.active)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((substance) => (
                <label
                  key={substance.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-tertiary cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedSubstances.includes(substance.id)}
                    onChange={() => toggleSubstance(substance.id)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-sm">{substance.name}</span>
                </label>
              ))}
          </div>
        )}
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

        {/* Usage by Person */}
        {usageByPersonData.length > 0 ? (
          <div className="card col-span-full md:col-span-1">
            <h3 className="text-lg font-bold mb-4">Usage by Person</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usageByPersonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #303030',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Bar dataKey="usage" fill="#2E6F40" name="Usage (g)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="card col-span-full md:col-span-1 flex items-center justify-center py-12">
            <p className="text-slate-400">No entries yet</p>
          </div>
        )}
      </div>

      {/* All Flavors Overview */}
      {allSubstancesData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold mb-4">All Flavors Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allSubstancesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Legend />
              <Bar dataKey="remaining" fill="#2E6F40" name="Remaining (g)" />
              <Bar dataKey="used" fill="#ef4444" name="Used (g)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
