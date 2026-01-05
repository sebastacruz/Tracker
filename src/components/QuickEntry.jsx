/**
 * QuickEntry component - Main data entry screen
 * Optimized for quick, one-tap entry of substance usage data
 */
import { useState, useRef, useEffect, useMemo } from 'react';
import { useEntries } from '../hooks/useEntries';
import { calculateDelta } from '../utils/calculations';

/**
 * Sanitize input to prevent XSS attacks
 * Removes potentially dangerous HTML/script content
 */
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return '';

  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

export default function QuickEntry({ substances }) {
  const { entries, addEntry, getUniquePeople } = useEntries();
  const [selectedSubstance, setSelectedSubstance] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [initialMass, setInitialMass] = useState('');
  const [finalMass, setFinalMass] = useState('');
  const [notes, setNotes] = useState('');
  const [delta, setDelta] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showFlavorMenu, setShowFlavorMenu] = useState(false);
  const [showPersonMenu, setShowPersonMenu] = useState(false);

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

  // Validate mass input (must be non-negative number)
  const isValidMass = (value) => {
    if (!value) return false;
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0;
  };

  // Validate form state for submit button
  const isFormValid = useMemo(() => {
    return (
      selectedSubstance && selectedPerson && isValidMass(initialMass) && isValidMass(finalMass)
    );
  }, [selectedSubstance, selectedPerson, initialMass, finalMass]);

  // Get validation feedback for mass inputs
  const getMassValidation = (mass) => {
    if (!mass) return { valid: null, message: '' };
    const num = parseFloat(mass);
    if (isNaN(num)) {
      return { valid: false, message: 'Must be a number' };
    }
    if (num < 0) {
      return { valid: false, message: 'Cannot be negative' };
    }
    return { valid: true, message: '' };
  };

  // Update delta when masses change
  const handleMassChange = (initial, final) => {
    setInitialMass(initial);
    setFinalMass(final);

    if (initial && final && isValidMass(initial) && isValidMass(final)) {
      const initialNum = parseFloat(initial);
      const finalNum = parseFloat(final);
      const calculated = calculateDelta(initialNum, finalNum);
      setDelta(calculated);
    } else {
      setDelta(null);
    }
  };

  const handleNotesChange = (value) => {
    // Sanitize input to prevent XSS
    const sanitized = sanitizeInput(value);
    setNotes(sanitized);
  };

  const handleDabSize = (deltaValue) => {
    if (!selectedSubstance || !selectedPerson) return;

    const substance = substances.find((s) => s.id === selectedSubstance);
    if (!substance) return;

    // Calculate current remaining mass based on theoretical initial mass and all previous entries
    const substanceEntries = entries.filter((e) => e.substanceId === selectedSubstance);
    const totalUsed = substanceEntries.reduce((sum, entry) => sum + (entry.delta || 0), 0);
    const currentMass = substance.theoreticalInitialMass - totalUsed;

    const initialMass = currentMass;
    const finalMass = currentMass - deltaValue;

    try {
      addEntry(selectedSubstance, selectedPerson, initialMass, finalMass, notes || null);

      // Set delta for success message display
      setDelta(deltaValue);

      // Reset notes but keep flavor and person selected for convenience
      setNotes('');
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setDelta(null);
      }, 3000);
    } catch (err) {
      setError(err.message || 'Error saving entry');
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
    if (!isValidMass(initialMass)) {
      setError('Initial mass must be a non-negative number');
      return;
    }
    if (!isValidMass(finalMass)) {
      setError('Final mass must be a non-negative number');
      return;
    }

    const initial = parseFloat(initialMass);
    const final = parseFloat(finalMass);

    try {
      addEntry(selectedSubstance, selectedPerson, initial, final, notes || null);

      // Reset form
      setSelectedSubstance('');
      setSelectedPerson('');
      setInitialMass('');
      setFinalMass('');
      setNotes('');
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
        <h2 className="text-3xl font-bold mb-2">Take a dab</h2>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-emerald-950/50 border border-emerald-700 rounded-lg text-emerald-200">
          Entry saved! Delta: {delta}g
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
              <span>
                {selectedSubstance
                  ? substances.find((s) => s.id === selectedSubstance)?.name
                  : 'Select a flavor...'}
              </span>
              <span className="text-slate-400">{showFlavorMenu ? '▲' : '▼'}</span>
            </button>

            {showFlavorMenu && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg z-50 max-h-64 overflow-y-auto">
                {substances
                  .filter((s) => s.active)
                  .map((substance) => (
                    <button
                      key={substance.id}
                      type="button"
                      onClick={() => {
                        setSelectedSubstance(substance.id);
                        setShowFlavorMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-700 transition-colors ${
                        selectedSubstance === substance.id
                          ? 'bg-emerald-700 text-white'
                          : 'text-slate-300'
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
                {getUniquePeople().map((person) => (
                  <button
                    key={person}
                    type="button"
                    onClick={() => {
                      setSelectedPerson(person);
                      setShowPersonMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-700 transition-colors ${
                      selectedPerson === person ? 'bg-emerald-700 text-white' : 'text-slate-300'
                    }`}
                  >
                    {person}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dab Size Buttons */}
        <div>
          <label className="label-base">
            Dab Size <span className="text-xs text-slate-400 font-normal">(tap to record)</span>
          </label>

          {/* ARIA live region for accessibility */}
          <div role="alert" aria-live="polite" className="sr-only">
            {(!selectedSubstance || !selectedPerson) &&
              'Please select a flavor and person before choosing dab size'}
          </div>

          {(!selectedSubstance || !selectedPerson) && (
            <p className="text-xs text-amber-500 mb-2">
              ⚠️ Please select a flavor and person first
            </p>
          )}

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleDabSize(0.03)}
              disabled={!selectedSubstance || !selectedPerson}
              className={`btn-secondary py-4 flex flex-col items-center justify-center transition-transform ${
                !selectedSubstance || !selectedPerson
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-emerald-700/20 hover:border-emerald-700 active:scale-95'
              }`}
              aria-label="Record small dab of 0.03 grams"
            >
              <span className="text-xs text-slate-400 block mb-1">Small</span>
              <span className="text-lg font-semibold">0.03g</span>
            </button>

            <button
              type="button"
              onClick={() => handleDabSize(0.04)}
              disabled={!selectedSubstance || !selectedPerson}
              className={`btn-secondary py-4 flex flex-col items-center justify-center transition-transform ${
                !selectedSubstance || !selectedPerson
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-emerald-700/20 hover:border-emerald-700 active:scale-95'
              }`}
              aria-label="Record regular dab of 0.04 grams"
            >
              <span className="text-xs text-slate-400 block mb-1">Regular</span>
              <span className="text-lg font-semibold">0.04g</span>
            </button>

            <button
              type="button"
              onClick={() => handleDabSize(0.05)}
              disabled={!selectedSubstance || !selectedPerson}
              className={`btn-secondary py-4 flex flex-col items-center justify-center transition-transform ${
                !selectedSubstance || !selectedPerson
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-emerald-700/20 hover:border-emerald-700 active:scale-95'
              }`}
              aria-label="Record large dab of 0.05 grams"
            >
              <span className="text-xs text-slate-400 block mb-1">Large</span>
              <span className="text-lg font-semibold">0.05g</span>
            </button>
          </div>
        </div>

        {/* Notes (Optional) */}
        <div>
          <label className="label-base">Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Add any notes about this entry..."
            className="input-base w-full resize-none"
            rows="2"
            maxLength="200"
          />
          {notes && <p className="text-xs text-slate-400 mt-1">{notes.length}/200 characters</p>}
        </div>
      </form>
    </div>
  );
}
