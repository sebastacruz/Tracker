/**
 * QuickEntry component - Main data entry screen
 * Optimized for quick, one-tap entry of substance usage data
 */
import { useState, useRef, useEffect } from 'react';
import { useEntries } from '../hooks/useEntries';
import { calculateDelta } from '../utils/calculations';

export default function QuickEntry({ substances }) {
  const { addEntry, getUniquePeople } = useEntries();
  const [selectedSubstance, setSelectedSubstance] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [initialMass, setInitialMass] = useState('');
  const [finalMass, setFinalMass] = useState('');
  const [delta, setDelta] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showFlavorMenu, setShowFlavorMenu] = useState(false);
  const [showPersonMenu, setShowPersonMenu] = useState(false);

  const uniquePeople = getUniquePeople();
  const flavorRef = useRef(null);
  const personRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (flavorRef.current && !flavorRef.current.contains(event.target)) {
        setShowFlavorMenu(false);
      }
      if (personRef.current && !personRef.current.contains(event.target)) {
        setShowPersonMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Update delta when masses change
  const handleMassChange = (initial, final) => {
    setInitialMass(initial);
    setFinalMass(final);

    if (initial && final) {
      const calculated = calculateDelta(parseFloat(initial), parseFloat(final));
      setDelta(calculated);
    } else {
      setDelta(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!selectedSubstance) {
      setError('Please select a flavor');
      return;
    }
    if (!selectedPerson) {
      setError('Please enter a person name');
      return;
    }
    if (!initialMass || !finalMass) {
      setError('Please enter both initial and final mass');
      return;
    }

    const initial = parseFloat(initialMass);
    const final = parseFloat(finalMass);

    if (isNaN(initial) || isNaN(final)) {
      setError('Please enter valid numbers');
      return;
    }

    try {
      addEntry(selectedSubstance, selectedPerson, initial, final);
      
      // Reset form
      setSelectedSubstance('');
      setSelectedPerson('');
      setInitialMass('');
      setFinalMass('');
      setDelta(null);
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Error saving entry');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Quick Entry</h2>
        <p className="text-slate-400">Record substance usage</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-900 border border-green-700 rounded-lg text-green-100">
          ✅ Entry saved! Delta: {delta}g
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded-lg text-red-100">
          ❌ {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Flavor Selection - Button Menu */}
        <div ref={flavorRef}>
          <label className="label-base">Flavor</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFlavorMenu(!showFlavorMenu)}
              className="input-base w-full text-left flex justify-between items-center"
            >
              <span>{selectedSubstance ? substances.find(s => s.id === selectedSubstance)?.name : 'Select a flavor...'}</span>
              <span className="text-slate-400">{showFlavorMenu ? '▲' : '▼'}</span>
            </button>
            
            {showFlavorMenu && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg z-50 max-h-64 overflow-y-auto">
                {substances.filter(s => s.active).map(substance => (
                  <button
                    key={substance.id}
                    type="button"
                    onClick={() => {
                      setSelectedSubstance(substance.id);
                      setShowFlavorMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-700 transition-colors ${
                      selectedSubstance === substance.id ? 'bg-blue-600 text-white' : 'text-slate-300'
                    }`}
                  >
                    {substance.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Person Selection - Button Menu */}
        <div ref={personRef}>
          <label className="label-base">Person</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPersonMenu(!showPersonMenu)}
              className="input-base w-full text-left flex justify-between items-center"
            >
              <span>{selectedPerson || 'Select a person...'}</span>
              <span className="text-slate-400">{showPersonMenu ? '▲' : '▼'}</span>
            </button>
            
            {showPersonMenu && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg z-50 max-h-64 overflow-y-auto">
                {getUniquePeople().map(person => (
                  <button
                    key={person}
                    type="button"
                    onClick={() => {
                      setSelectedPerson(person);
                      setShowPersonMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-700 transition-colors ${
                      selectedPerson === person ? 'bg-blue-600 text-white' : 'text-slate-300'
                    }`}
                  >
                    {person}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Initial Mass */}
        <div>
          <label className="label-base">Initial Mass (g)</label>
          <input
            type="number"
            step="0.01"
            value={initialMass}
            onChange={(e) => handleMassChange(e.target.value, finalMass)}
            placeholder="0.00"
            className="input-base w-full text-lg font-semibold"
            autoFocus
          />
        </div>

        {/* Final Mass */}
        <div>
          <label className="label-base">Final Mass (g)</label>
          <input
            type="number"
            step="0.01"
            value={finalMass}
            onChange={(e) => handleMassChange(initialMass, e.target.value)}
            placeholder="0.00"
            className="input-base w-full text-lg font-semibold"
          />
        </div>

        {/* Delta Display */}
        {delta !== null && (
          <div className="p-4 bg-blue-900 border border-blue-700 rounded-lg">
            <p className="text-slate-300 text-sm mb-1">Mass Used (Delta)</p>
            <p className="text-3xl font-bold text-blue-100">{delta}g</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary w-full py-3 text-lg font-bold"
        >
          💾 Save Entry
        </button>
      </form>

      {/* Help Text */}
      <div className="mt-8 p-4 bg-slate-800 rounded-lg text-slate-300 text-sm">
        <p className="font-semibold mb-2">💡 How it works:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Select or add a substance</li>
          <li>Enter the scale reading <strong>before</strong> use (Initial)</li>
          <li>Enter the scale reading <strong>after</strong> use (Final)</li>
          <li>Delta is calculated automatically</li>
          <li>Tap save to record the entry</li>
        </ol>
      </div>
    </div>
  );
}
