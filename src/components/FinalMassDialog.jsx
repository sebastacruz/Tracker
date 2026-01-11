/**
 * FinalMassDialog - Modal to capture final mass when finishing a flavor
 */
import { useEffect, useState } from 'react';

export default function FinalMassDialog({
  isOpen,
  onConfirm,
  onCancel,
  substanceName,
  theoreticalInitialMass,
  totalInitialMass,
}) {
  const [finalMass, setFinalMass] = useState('');
  const [error, setError] = useState('');

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFinalMass('');
      setError('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const finalMassNum = parseFloat(finalMass);
    const referenceMass = totalInitialMass || theoreticalInitialMass;

    if (!finalMass || isNaN(finalMassNum)) {
      setError('Please enter a valid final mass');
      return;
    }

    if (finalMassNum < 0) {
      setError('Final mass cannot be negative');
      return;
    }

    if (finalMassNum > referenceMass) {
      setError(`Final mass cannot exceed ${referenceMass}g (initial mass)`);
      return;
    }

    onConfirm(finalMassNum);
  };

  const handleSkip = () => {
    onConfirm(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-slate-100">Finish Flavor: {substanceName}</h3>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            <p className="text-slate-300">
              Enter the final mass to calculate actual usage and average dab mass.
            </p>

            <div>
              <label className="label-base">Final Mass (g)</label>
              <input
                type="number"
                step="0.01"
                value={finalMass}
                onChange={(e) => {
                  setFinalMass(e.target.value);
                  setError('');
                }}
                placeholder="e.g., 2.5"
                className="input-base w-full"
                autoFocus
              />
              <p className="text-xs text-slate-400 mt-1">
                {totalInitialMass ? (
                  <>
                    Total purchased: {totalInitialMass}g | In use: {theoreticalInitialMass}g
                  </>
                ) : (
                  <>Initial mass: {theoreticalInitialMass}g</>
                )}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            {finalMass && !error && parseFloat(finalMass) >= 0 && (
              <div className="p-3 bg-blue-900/50 border border-blue-700 rounded-lg text-blue-200 text-sm">
                <p className="font-semibold mb-1">Calculated Usage:</p>
                <p>
                  Actual mass used:{' '}
                  <span className="font-mono font-bold">
                    {((totalInitialMass || theoreticalInitialMass) - parseFloat(finalMass)).toFixed(
                      2
                    )}
                    g
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-slate-800/50 flex gap-3 justify-between">
            <button
              type="button"
              onClick={handleSkip}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium transition-colors text-sm"
            >
              Skip (No Final Mass)
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
              >
                Finish Flavor
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
