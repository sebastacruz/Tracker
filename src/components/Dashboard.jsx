/**
 * Dashboard component - Personal usage analytics for user "t"
 */
import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  getOverallStats,
  getPerSubstanceStats,
  getWeeklyComparison,
  getSubstanceMassDistribution,
  formatTimestamp,
} from '../utils/calculations';

const COLORS = ['#2E6F40', '#358D47', '#6B8E6B', '#10b981'];

export default function Dashboard({ substances, entries }) {
  const [selectedSubstances, setSelectedSubstances] = useState(() => {
    const activeSubstances = substances.filter((s) => s.active);
    return activeSubstances.length > 0 ? [activeSubstances[0].id] : [];
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [showAllCharts, setShowAllCharts] = useState(false);

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  // Calculate all stats for user "t"
  const overallStats = useMemo(() => getOverallStats(entries, 't'), [entries]);

  const substanceStats = useMemo(
    () => getPerSubstanceStats(entries, 't', substances, true),
    [entries, substances]
  );

  const weeklyComparison = useMemo(() => getWeeklyComparison(entries, 't'), [entries]);

  const pieChartsData = useMemo(() => {
    return substances
      .filter((s) => s.active)
      .map((substance) => ({
        substance,
        distribution: getSubstanceMassDistribution(substance, entries),
      }));
  }, [substances, entries]);

  // Chart: Remaining mass over time (filtered to "t")
  const remainingOverTimeData = useMemo(() => {
    if (selectedSubstances.length === 0) return [];

    const tEntries = entries.filter((e) => e.person === 't');
    const filteredEntries = tEntries
      .filter((e) => selectedSubstances.includes(e.substanceId))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (filteredEntries.length === 0) return [];

    const substanceLookup = substances.reduce((acc, s) => {
      acc[s.id] = s;
      return acc;
    }, {});

    const timeMap = {};
    const substanceRunning = {};

    selectedSubstances.forEach((id) => {
      substanceRunning[id] = 0;
    });

    filteredEntries.forEach((entry) => {
      substanceRunning[entry.substanceId] += entry.delta;
      const time = formatTimestamp(entry.timestamp);
      const key = `${time.date} ${time.time}`;

      if (!timeMap[key]) {
        timeMap[key] = { date: time.date, time: time.time, timestamp: entry.timestamp };
      }

      const substance = substanceLookup[entry.substanceId];
      if (substance) {
        const remaining = substance.advertisedMass - substanceRunning[entry.substanceId];
        timeMap[key][substance.name] = Number(remaining.toFixed(2));
      }
    });

    return Object.values(timeMap).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [selectedSubstances, entries, substances]);

  // Custom Legend formatter for pie charts with proper wrapping
  const formatPieLegend = (value, entry) => {
    const percent = entry.payload.percent;
    if (percent < 0.01) return null; // Hide items < 1%
    return `${value}: ${(percent * 100).toFixed(0)}%`;
  };

  if (substances.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="card text-center py-12">
          <p className="text-slate-400 text-lg">No data to display</p>
          <p className="text-slate-500 text-sm mt-2">Add flavors and entries to see charts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Your Stats</h2>
          <p className="text-slate-400">Personal usage analytics</p>
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

      {/* Stats Cards */}
      <div className="grid gap-4 mb-6 md:grid-cols-2">
        {/* Overall Summary */}
        <div className="card">
          <h3 className="text-lg font-bold mb-4">Overall Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Mass per active day</span>
              <span className="text-2xl font-mono font-bold text-emerald-400">
                {overallStats.massPerActiveDay}g
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Mass per calendar day</span>
              <span className="text-lg font-mono text-slate-300">{overallStats.massPerDay}g</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-700 pt-3">
              <span className="text-slate-400">Sessions per active day</span>
              <span className="text-xl font-mono font-bold text-emerald-400">
                {overallStats.sessionsPerActiveDay}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Sessions per calendar day</span>
              <span className="text-lg font-mono text-slate-300">
                {overallStats.sessionsPerDay}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-700 pt-3">
              <span className="text-slate-400">Total mass</span>
              <span className="font-mono text-slate-300">{overallStats.totalMass}g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total sessions</span>
              <span className="font-mono text-slate-300">{overallStats.totalSessions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Active days</span>
              <span className="font-mono text-slate-300">{overallStats.activeDays}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Calendar span</span>
              <span className="font-mono text-slate-300">{overallStats.dateRange.days} days</span>
            </div>
          </div>
        </div>

        {/* Weekly Comparison */}
        <div className="card">
          <h3 className="text-lg font-bold mb-4">This Week vs Last Week</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-400">Mass per day</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-mono font-bold text-emerald-400">
                  {weeklyComparison.current.massPerDay}g/day
                </span>
                <span className="text-sm text-slate-400">
                  vs {weeklyComparison.previous.massPerDay}g/day
                </span>
                {weeklyComparison.change.mass !== 0 && (
                  <span
                    className={`text-sm font-medium ${
                      weeklyComparison.change.mass > 0 ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {weeklyComparison.change.mass > 0 ? '↑' : '↓'}{' '}
                    {Math.abs(weeklyComparison.change.mass)}%
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                This week: {weeklyComparison.current.mass}g ({weeklyComparison.current.daysElapsed}{' '}
                days) | Last week: {weeklyComparison.previous.mass}g (7 days)
              </div>
            </div>
            <div className="border-t border-slate-700 pt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-400">Sessions per day</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-mono font-bold text-emerald-400">
                  {weeklyComparison.current.sessionsPerDay}/day
                </span>
                <span className="text-sm text-slate-400">
                  vs {weeklyComparison.previous.sessionsPerDay}/day
                </span>
                {weeklyComparison.change.sessions !== 0 && (
                  <span
                    className={`text-sm font-medium ${
                      weeklyComparison.change.sessions > 0 ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {weeklyComparison.change.sessions > 0 ? '↑' : '↓'}{' '}
                    {Math.abs(weeklyComparison.change.sessions)}%
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                This week: {weeklyComparison.current.sessions} sessions | Last week:{' '}
                {weeklyComparison.previous.sessions} sessions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Per-Substance Breakdown Table */}
      {substanceStats.length > 0 && (
        <div className="card mb-6">
          <h3 className="text-lg font-bold mb-4">Your Usage by Flavor</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 px-2 text-slate-400 font-medium">Flavor</th>
                  <th className="text-right py-2 px-2 text-slate-400 font-medium">Used (g)</th>
                  <th className="text-right py-2 px-2 text-slate-400 font-medium">Sessions</th>
                  <th className="text-right py-2 px-2 text-slate-400 font-medium hidden md:table-cell">
                    Avg/Dab
                  </th>
                  <th className="text-right py-2 px-2 text-slate-400 font-medium hidden lg:table-cell">
                    g/day
                  </th>
                  <th className="text-right py-2 px-2 text-slate-400 font-medium hidden lg:table-cell">
                    Sess/day
                  </th>
                  <th className="text-right py-2 px-2 text-slate-400 font-medium text-xs hidden lg:table-cell">
                    Days
                  </th>
                </tr>
              </thead>
              <tbody>
                {substanceStats.map((stat) => (
                  <tr key={stat.substance.id} className="border-b border-slate-800">
                    <td className="py-4 px-2 font-medium text-slate-200">
                      {stat.substance.name}
                      {!stat.substance.active && (
                        <span className="ml-2 text-xs text-slate-500">(Inactive)</span>
                      )}
                    </td>
                    <td className="py-4 px-2 text-right font-mono text-emerald-400">
                      {stat.actualMassUsed > 0 && stat.actualMassUsed !== stat.totalMass ? (
                        <span title={`From entries: ${stat.totalMass}g`}>
                          {stat.actualMassUsed}*
                        </span>
                      ) : (
                        stat.totalMass
                      )}
                    </td>
                    <td className="py-4 px-2 text-right font-mono text-slate-300">
                      {stat.sessions}
                    </td>
                    <td className="py-4 px-2 text-right font-mono text-purple-400 hidden md:table-cell">
                      {stat.avgDabMass > 0 ? stat.avgDabMass : '-'}
                    </td>
                    <td className="py-4 px-2 text-right font-mono text-slate-300 hidden lg:table-cell">
                      {stat.massPerActiveDay}
                    </td>
                    <td className="py-4 px-2 text-right font-mono text-slate-300 hidden lg:table-cell">
                      {stat.sessionsPerActiveDay}
                    </td>
                    <td className="py-4 px-2 text-right font-mono text-slate-500 text-xs hidden lg:table-cell">
                      {stat.activeDays}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-slate-500 mt-2">
              * Actual mass used (calculated from final mass)
            </p>
          </div>
        </div>
      )}

      {/* Mass Distribution Pie Charts */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Mass Distribution by Flavor</h3>
          {pieChartsData.length > 4 && (
            <button
              onClick={() => setShowAllCharts(!showAllCharts)}
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors px-3 py-2 rounded-lg hover:bg-emerald-400/10 font-medium"
            >
              {showAllCharts ? (
                'Show Less'
              ) : (
                <>
                  Show All {pieChartsData.length}{' '}
                  <span className="text-slate-500 text-xs">+{pieChartsData.length - 4}</span>
                </>
              )}
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 min-[375px]:grid-cols-2 md:grid-cols-3 gap-4">
          {(showAllCharts ? pieChartsData : pieChartsData.slice(0, 4)).map(
            ({ substance, distribution }) => (
              <div key={substance.id} className="flex flex-col items-center pb-2">
                <p className="text-sm font-medium text-slate-300 mb-2">{substance.name}</p>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={distribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                    >
                      {distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      height={48}
                      iconType="circle"
                      formatter={formatPieLegend}
                      wrapperStyle={{
                        fontSize: '11px',
                        paddingTop: '8px',
                        lineHeight: '1.6',
                      }}
                      iconSize={8}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1A1A',
                        border: '1px solid #303030',
                        borderRadius: '8px',
                      }}
                      formatter={(value) => `${value}g`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )
          )}
        </div>
      </div>

      {/* Flavor Selector for Line Chart */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <label className="label-base">Select Flavors for Timeline</label>
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

        <div className="mb-4 flex justify-between items-center">
          <label className="text-sm text-slate-400 flex items-center gap-2">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="rounded bg-slate-700 border-slate-600"
            />
            Show inactive flavors
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {substances
            .filter((s) => showInactive || s.active)
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
                  <div className="flex justify-between items-center">
                    <span>{substance.name}</span>
                    {!substance.active && (
                      <span className="text-xs text-slate-500">(Inactive)</span>
                    )}
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      {/* Consumption Over Time Line Chart */}
      {remainingOverTimeData.length > 0 ? (
        <div className="card mb-6">
          <h3 className="text-lg font-bold mb-4">Your Consumption Over Time</h3>
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
                const substance = substances.find((s) => s.id === substanceId);
                return (
                  <Line
                    key={substanceId}
                    type="monotone"
                    dataKey={substance?.name}
                    stroke={COLORS[index % COLORS.length]}
                    name={`${substance?.name} (g remaining)`}
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
        <div className="card flex items-center justify-center py-12">
          <p className="text-slate-400">Select flavors above to see your consumption timeline</p>
        </div>
      )}
    </div>
  );
}
