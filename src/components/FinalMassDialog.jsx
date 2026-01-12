/**
 * FinalMassDialog - Modal to capture final mass when finishing a flavor
 */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function FinalMassDialog({
  isOpen,
  onConfirm,
  onCancel,
  substanceName,
  advertisedMass,
  grossInitialMass,
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
    const referenceMass = grossInitialMass || advertisedMass;

    if (!finalMass || isNaN(finalMassNum)) {
      setError('Please enter a valid gross final mass');
      return;
    }

    if (finalMassNum < 0) {
      setError('Gross final mass cannot be negative');
      return;
    }

    if (finalMassNum > referenceMass) {
      setError(`Gross final mass cannot exceed ${referenceMass}g (gross initial mass)`);
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
            {grossInitialMass ? (
              <div className="p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                <p className="text-blue-200 text-sm font-semibold mb-2">
                  ⚠️ Important: Weigh the jar + remaining product
                </p>
                <p className="text-blue-300/90 text-xs">
                  Put the jar on the scale to get the total gross weight (container + remaining
                  product). Compare against gross initial mass of{' '}
                  <strong>{grossInitialMass}g</strong>.
                </p>
              </div>
            ) : (
              <p className="text-slate-300">
                Enter the gross final mass (jar + remaining product) to calculate actual usage.
              </p>
            )}

            <div>
              <label className="label-base">Gross Final Mass (g)</label>
              <input
                type="number"
                step="0.01"
                value={finalMass}
                onChange={(e) => {
                  setFinalMass(e.target.value);
                  setError('');
                }}
                placeholder={
                  grossInitialMass ? `Max: ${grossInitialMass}g` : `Max: ${advertisedMass}g`
                }
                className="input-base w-full"
                autoFocus
              />
              <p className="text-xs text-slate-400 mt-1">
                {grossInitialMass ? (
                  <>
                    <strong>Reference:</strong> {grossInitialMass}g gross initial mass |{' '}
                    {advertisedMass}g advertised product
                  </>
                ) : (
                  <>
                    <strong>Reference:</strong> {advertisedMass}g advertised mass
                  </>
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
                    {((grossInitialMass || advertisedMass) - parseFloat(finalMass)).toFixed(2)}g
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

FinalMassDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  substanceName: PropTypes.string.isRequired,
  advertisedMass: PropTypes.number.isRequired,
  grossInitialMass: PropTypes.number,
};
