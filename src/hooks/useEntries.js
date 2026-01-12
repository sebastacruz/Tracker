/**
 * Custom hook for managing usage entries
 */
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getData, saveData } from '../utils/storage';

export function useEntries() {
  const [entries, setEntries] = useState([]);

  // Load entries from storage on mount
  useEffect(() => {
    const data = getData();
    setEntries(data.entries || []);
  }, []);

  const addEntry = useCallback((substanceId, person, delta, notes = null) => {
    if (!substanceId || !person || typeof delta !== 'number') {
      throw new Error('Invalid entry data');
    }

    const newEntry = {
      id: uuidv4(),
      substanceId,
      person: person.trim(),
      delta: Number(delta),
      timestamp: new Date().toISOString(),
      ...(notes && { notes: notes.trim() }), // Only include notes if provided
    };

    setEntries((prev) => {
      const updated = [newEntry, ...prev]; // Newest first
      const data = getData();
      saveData({ ...data, entries: updated });
      return updated;
    });

    return newEntry;
  }, []);

  const deleteEntry = useCallback((id) => {
    if (window.confirm('Delete this entry?')) {
      setEntries((prev) => {
        const updated = prev.filter((e) => e.id !== id);
        const data = getData();
        saveData({ ...data, entries: updated });
        return updated;
      });
    }
  }, []);

  const updateEntry = useCallback((id, delta) => {
    if (typeof delta !== 'number') {
      throw new Error('Invalid delta value');
    }

    setEntries((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, delta: Number(delta) } : e));
      const data = getData();
      saveData({ ...data, entries: updated });
      return updated;
    });
  }, []);

  const getEntriesBySubstance = useCallback(
    (substanceId) => {
      return entries.filter((e) => e.substanceId === substanceId);
    },
    [entries]
  );

  const getEntriesByPerson = useCallback(
    (person) => {
      return entries.filter((e) => e.person === person);
    },
    [entries]
  );

  const getUniquePeople = useCallback(() => {
    return [...new Set(entries.map((e) => e.person))].sort();
  }, [entries]);

  return {
    entries,
    addEntry,
    deleteEntry,
    updateEntry,
    getEntriesBySubstance,
    getEntriesByPerson,
    getUniquePeople,
  };
}
