/**
 * QuickEntry component - Main data entry screen
 * Optimized for quick, one-tap entry of substance usage data
 */
import { useState } from 'react';
import { useEntries } from '../hooks/useEntries';
import ConfirmDialog from './ConfirmDialog';

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

export default function QuickEntry({ substances, entries: entriesProp }) {
  const { addEntry, getUniquePeople } = useEntries();
  const entries = entriesProp;
  const [selectedSubstance, setSelectedSubstance] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [initialMass, setInitialMass] = useState('');
  const [finalMass, setFinalMass] = useState('');
  const [notes, setNotes] = useState('');
  const [delta, setDelta] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, dabSize: 0 });

  // Validate mass input (must be non-negative number)
  const isValidMass = (value) => {
    if (!value) return false;
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0;
  };

  const handleNotesChange = (value) => {
    // Sanitize input to prevent XSS
    const sanitized = sanitizeInput(value);
    setNotes(sanitized);
  };

  const handleDabSizeClick = (deltaValue) => {
    if (!selectedSubstance || !selectedPerson) return;

    // Show confirmation dialog
    setConfirmDialog({ isOpen: true, dabSize: deltaValue });
  };

  const handleConfirmDab = () => {
    const deltaValue = confirmDialog.dabSize;
    setConfirmDialog({ isOpen: false, dabSize: 0 });

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

  const handleCancelDab = () => {
    setConfirmDialog({ isOpen: false, dabSize: 0 });
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
        {/* Flavor Selection - Button Grid */}
        <div className="space-y-3">
          <label className="label-base">Select Flavor</label>
          <div className="grid grid-cols-2 gap-3">
            {substances
              .filter((s) => s.active)
              .map((substance) => (
                <button
                  key={substance.id}
                  type="button"
                  onClick={() => setSelectedSubstance(substance.id)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all text-left ${
                    selectedSubstance === substance.id
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                      : 'border-slate-700 bg-slate-800 hover:border-slate-600 text-slate-300'
                  }`}
                >
                  {substance.name}
                </button>
              ))}
          </div>
        </div>

        {/* Person Selection - Button Grid */}
        <div className="space-y-3">
          <label className="label-base">Select Person</label>
          <div className="grid grid-cols-2 gap-3">
            {getUniquePeople().map((person) => (
              <button
                key={person}
                type="button"
                onClick={() => setSelectedPerson(person)}
                className={`px-4 py-3 rounded-lg border-2 transition-all ${
                  selectedPerson === person
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                {person.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Dab Size Buttons */}
        <div>
          <label className="label-base">Dab Size</label>

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
              onClick={() => handleDabSizeClick(0.03)}
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
              onClick={() => handleDabSizeClick(0.04)}
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
              onClick={() => handleDabSizeClick(0.05)}
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

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onConfirm={handleConfirmDab}
        onCancel={handleCancelDab}
        title="Confirm Entry"
        message={`Record a ${confirmDialog.dabSize}g dab for ${selectedPerson}?`}
        confirmText="Yes, Record"
        cancelText="Cancel"
      />
    </div>
  );
}
