/**
 * SubstanceManager component - Add, edit, and delete substances
 *
 * Features:
 * - Add new substances with customizable theoretical initial mass
 * - Default mass for new substances is 1g (editable before saving)
 * - View remaining mass and usage statistics
 * - Delete substances when no longer needed
 */
import { useState } from 'react';
import { useSubstances } from '../hooks/useSubstances';
import { useEntries } from '../hooks/useEntries';
import { getSubstanceRemaining, getUsageRate, getProjectedDepletion } from '../utils/calculations';

export default function SubstanceManager() {
  const { substances, addSubstance, deleteSubstance, deactivateSubstance, reactivateSubstance } =
    useSubstances();
  const { entries, getEntriesBySubstance } = useEntries();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [theoreticalMass, setTheoreticalMass] = useState('1');
  const [totalInitialMass, setTotalInitialMass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterActive, setFilterActive] = useState(true);

  const handleAddSubstance = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Please enter a flavor name');
      return;
    }

    if (!theoreticalMass || parseFloat(theoreticalMass) <= 0) {
      setError('Please enter a valid theoretical initial mass');
      return;
    }

    if (totalInitialMass && parseFloat(totalInitialMass) <= 0) {
      setError('Total initial mass must be positive if provided');
      return;
    }

    try {
      addSubstance(
        name,
        parseFloat(theoreticalMass),
        totalInitialMass ? parseFloat(totalInitialMass) : null
      );
      setName('');
      setTheoreticalMass('1');
      setTotalInitialMass('');
      setShowForm(false);
      setSuccess('Flavor added! You can now select it from the entry screen.');
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    } catch (err) {
      setError(err.message || 'Error adding flavor');
    }
  };

  const handleFinishFlavor = (substance) => {
    if (
      window.confirm(
        `Mark "${substance.name}" as finished? It will be hidden from Quick Entry but remain in history.`
      )
    ) {
      deactivateSubstance(substance.id);
      setSuccess(`"${substance.name}" has been finished and moved to inactive.`);
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    }
  };

  const handleReactivate = (substance) => {
    reactivateSubstance(substance.id);
    setSuccess(`"${substance.name}" has been reactivated!`);
    setTimeout(() => {
      setSuccess('');
    }, 5000);
  };

  const filteredSubstances = substances.filter((s) => s.active === filterActive);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Flavors</h2>
      </div>

      {/* Active/Inactive Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilterActive(true)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterActive
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          Active ({substances.filter((s) => s.active).length})
        </button>
        <button
          onClick={() => setFilterActive(false)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            !filterActive
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          Inactive ({substances.filter((s) => !s.active).length})
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-emerald-950/50 border border-emerald-700 rounded-lg text-emerald-200">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded-lg text-red-100">
          ❌ {error}
        </div>
      )}

      {/* Add Flavor Button */}
      {!showForm && (
        <button onClick={() => setShowForm(true)} className="btn-primary mb-6">
          + Add New Flavor
        </button>
      )}

      {/* Add Flavor Form */}
      {showForm && (
        <div className="card mb-6 max-w-md">
          <h3 className="text-lg font-bold mb-4">Add New Flavor</h3>
          <form onSubmit={handleAddSubstance} className="space-y-4">
            <div>
              <label className="label-base">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Apollo"
                className="input-base w-full"
                autoFocus
              />
            </div>

            <div>
              <label className="label-base">Theoretical Initial Mass (g)</label>
              <input
                type="number"
                step="0.01"
                value={theoreticalMass}
                onChange={(e) => setTheoreticalMass(e.target.value)}
                placeholder="e.g., 50.0"
                className="input-base w-full"
              />
              <p className="text-xs text-slate-400 mt-2">
                The mass when first put into use. Used to calculate remaining amount.
              </p>
            </div>

            <div>
              <label className="label-base">Total Initial Mass (g) - Optional</label>
              <input
                type="number"
                step="0.01"
                value={totalInitialMass}
                onChange={(e) => setTotalInitialMass(e.target.value)}
                placeholder="e.g., 3.5"
                className="input-base w-full"
              />
              <p className="text-xs text-slate-400 mt-2">
                The total purchased amount. This will be tracked separately and displayed as
                &quot;Total Mass&quot; in the substance details.
              </p>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1">
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setName('');
                  setTheoreticalMass('1');
                  setTotalInitialMass('');
                  setError('');
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Flavors List */}
      {filteredSubstances.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-slate-400 text-lg">
            {filterActive ? 'No active flavors' : 'No inactive flavors'}
          </p>
          <p className="text-slate-500 text-sm mt-2">
            {filterActive
              ? 'Add your first flavor to get started'
              : 'Finished flavors will appear here'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredSubstances.map((substance) => {
            const substanceEntries = getEntriesBySubstance(substance.id);
            const remaining = getSubstanceRemaining(substance, entries);
            const usageRate = getUsageRate(substance, entries);
            const depletion = getProjectedDepletion(substance, entries);
            const percentRemaining =
              remaining > 0 ? ((remaining / substance.theoreticalInitialMass) * 100).toFixed(1) : 0;

            return (
              <div key={substance.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold">{substance.name}</h3>
                  <div className="flex gap-2">
                    {substance.active ? (
                      <>
                        <button
                          onClick={() => handleFinishFlavor(substance)}
                          className="text-slate-400 hover:text-slate-300 text-sm font-medium"
                        >
                          Finish
                        </button>
                        <button
                          onClick={() => deleteSubstance(substance.id)}
                          className="text-red-400 hover:text-red-300 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleReactivate(substance)}
                          className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                        >
                          Reactivate
                        </button>
                        <button
                          onClick={() => deleteSubstance(substance.id)}
                          className="text-red-400 hover:text-red-300 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2 mb-4 text-sm">
                  {substance.totalInitialMass && (
                    <div className="flex justify-between text-slate-300">
                      <span>Total Mass:</span>
                      <span className="font-mono font-bold text-blue-400">
                        {substance.totalInitialMass}g
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-300">
                    <span>Initial (Theoretical):</span>
                    <span className="font-mono">{substance.theoreticalInitialMass}g</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Remaining:</span>
                    <span
                      className={`font-mono font-bold ${remaining > 0 ? 'text-emerald-400' : 'text-red-400'}`}
                    >
                      {remaining}g
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Used:</span>
                    <span className="font-mono">
                      {(substance.theoreticalInitialMass - remaining).toFixed(2)}g
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Entries:</span>
                    <span className="font-mono">{substanceEntries.length}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Usage Rate:</span>
                    <span className="font-mono">{usageRate > 0 ? `${usageRate}g/day` : 'N/A'}</span>
                  </div>
                  {depletion.depleted && (
                    <div className="flex justify-between text-red-400">
                      <span>Status:</span>
                      <span className="font-mono font-bold">DEPLETED</span>
                    </div>
                  )}
                  {!depletion.depleted && depletion.daysRemaining !== null && (
                    <div className="flex justify-between text-slate-300">
                      <span>Est. Depletion:</span>
                      <span className="font-mono">
                        {depletion.daysRemaining} day{depletion.daysRemaining !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                  {!depletion.depleted && depletion.date && (
                    <div className="flex justify-between text-slate-400 text-xs">
                      <span>Depletion Date:</span>
                      <span className="font-mono">{depletion.date.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-400">
                      {remaining > 0 ? 'Remaining' : 'Overconsumption'}
                    </span>
                    <span className="text-xs font-mono text-slate-300">
                      {remaining > 0
                        ? `${percentRemaining}%`
                        : `${Math.abs(percentRemaining)}% over`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${remaining > 0 ? 'bg-emerald-700' : 'bg-red-600'}`}
                      style={{ width: `${Math.min(Math.abs(percentRemaining), 100)}%` }}
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="text-xs text-slate-400">
                  Created: {new Date(substance.createdAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
