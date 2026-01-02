/**
 * Custom hook for managing substances
 */
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getData, saveData } from '../utils/storage';

export function useSubstances() {
  const [substances, setSubstances] = useState([]);

  // Load substances from storage on mount
  useEffect(() => {
    const data = getData();
    setSubstances(data.substances || []);
  }, []);

  const addSubstance = useCallback((name, theoreticalInitialMass) => {
    if (!name || typeof theoreticalInitialMass !== 'number') {
      throw new Error('Invalid substance data');
    }

    const newSubstance = {
      id: uuidv4(),
      name: name.trim(),
      theoreticalInitialMass: Number(theoreticalInitialMass),
      createdAt: new Date().toISOString(),
      active: true,
    };

    setSubstances(prev => {
      const updated = [...prev, newSubstance];
      const data = getData();
      saveData({ ...data, substances: updated });
      return updated;
    });

    return newSubstance;
  }, []);

  const updateSubstance = useCallback((id, updates) => {
    setSubstances(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...updates } : s);
      const data = getData();
      saveData({ ...data, substances: updated });
      return updated;
    });
  }, []);

  const deleteSubstance = useCallback((id) => {
    if (window.confirm('Delete this substance? Historical data will remain.')) {
      setSubstances(prev => {
        const updated = prev.filter(s => s.id !== id);
        const data = getData();
        saveData({ ...data, substances: updated });
        return updated;
      });
    }
  }, []);

  const getSubstanceById = useCallback((id) => {
    return substances.find(s => s.id === id);
  }, [substances]);

  return {
    substances,
    addSubstance,
    updateSubstance,
    deleteSubstance,
    getSubstanceById,
  };
}
