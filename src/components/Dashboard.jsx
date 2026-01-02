/**
 * Dashboard component - Visual analytics with charts
 */
import { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEntries } from '../hooks/useEntries';
import { getSubstanceRemaining, formatTimestamp } from '../utils/calculations';

export default function Dashboard({ substances }) {
  const { entries } = useEntries();
  const [selectedSubstance, setSelectedSubstance] = useState(substances[0]?.id || '');

  // Get substance lookup
  const substanceLookup = useMemo(() => {
    return substances.reduce((acc, s) => {
      acc[s.id] = s;
      return acc;
    }, {});
  }, [substances]);

  // Chart 1: Remaining mass over time for selected substance
  const remainingOverTimeData = useMemo(() => {
    if (!selectedSubstance) return [];

    const substance = substanceLookup[selectedSubstance];
    if (!substance) return [];

    const substanceEntries = entries
      .filter(e => e.substanceId === selectedSubstance)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    let runningTotal = 0;
    return substanceEntries.map(entry => {
      runningTotal += entry.delta;
      const remaining = substance.theoreticalInitialMass - runningTotal;
      const time = formatTimestamp(entry.timestamp);

      return {
        date: time.date,
        time: time.time,
        remaining: Number(remaining.toFixed(2)),
        delta: entry.delta,
        person: entry.person,
      };
    });
  }, [selectedSubstance, entries, substanceLookup]);

  // Chart 2: Usage by person (for selected substance)
  const usageByPersonData = useMemo(() => {
    if (!selectedSubstance) return [];

    const substanceEntries = entries.filter(e => e.substanceId === selectedSubstance);

    const personMap = {};
    substanceEntries.forEach(entry => {
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
  }, [selectedSubstance, entries]);

  // Chart 3: All substances remaining
  const allSubstancesData = useMemo(() => {
    return substances
      .filter(s => s.active)
      .map(substance => {
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

      {/* Substance Selector */}
      <div className="card mb-6 max-w-xs">
        <label className="label-base">Select Substance</label>
        <select
          value={selectedSubstance}
          onChange={(e) => setSelectedSubstance(e.target.value)}
          className="input-base w-full"
        >
          {substances.filter(s => s.active).map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
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
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                />
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
                <Line
                  type="monotone"
                  dataKey="remaining"
                  stroke="#3b82f6"
                  name="Remaining (g)"
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="card col-span-full md:col-span-1 flex items-center justify-center py-12">
            <p className="text-slate-400">No entries yet for this substance</p>
          </div>
        )}

        {/* Usage by Person */}
        {usageByPersonData.length > 0 ? (
          <div className="card col-span-full md:col-span-1">
            <h3 className="text-lg font-bold mb-4">Usage by Person</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usageByPersonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Bar dataKey="usage" fill="#3b82f6" name="Usage (g)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="card col-span-full md:col-span-1 flex items-center justify-center py-12">
            <p className="text-slate-400">No entries yet</p>
          </div>
        )}
      </div>

      {/* All Substances Overview */}
      {allSubstancesData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold mb-4">All Substances Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allSubstancesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
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
              <Bar dataKey="remaining" fill="#3b82f6" name="Remaining (g)" />
              <Bar dataKey="used" fill="#ef4444" name="Used (g)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
