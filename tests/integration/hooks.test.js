import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useSubstances } from '../../src/hooks/useSubstances'
import { useEntries } from '../../src/hooks/useEntries'

describe('useSubstances', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should initialize with empty substances array', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({
      substances: [],
      entries: [],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }))

    const { result } = renderHook(() => useSubstances())

    expect(result.current.substances).toEqual([])
  })

  it('should load substances from localStorage', async () => {
    const mockData = {
      substances: [
        { id: '1', name: 'Test', theoreticalInitialMass: 100, active: true }
      ],
      entries: [],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }

    localStorage.getItem.mockReturnValue(JSON.stringify(mockData))

    const { result } = renderHook(() => useSubstances())

    await waitFor(() => {
      expect(result.current.substances).toHaveLength(1)
      expect(result.current.substances[0].name).toBe('Test')
    })
  })

  it('should add a new substance', async () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({
      substances: [],
      entries: [],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }))

    const { result } = renderHook(() => useSubstances())

    let newSubstance
    await act(async () => {
      newSubstance = result.current.addSubstance('Apollo', 50.5)
    })

    expect(newSubstance).toBeDefined()
    expect(newSubstance.name).toBe('Apollo')
    expect(newSubstance.theoreticalInitialMass).toBe(50.5)
    expect(newSubstance.active).toBe(true)
    expect(newSubstance.id).toBeDefined()
    expect(newSubstance.createdAt).toBeDefined()

    await waitFor(() => {
      expect(result.current.substances).toHaveLength(1)
      expect(result.current.substances[0].name).toBe('Apollo')
    })

    expect(localStorage.setItem).toHaveBeenCalled()
  })

  it('should throw error when adding substance with invalid data', async () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({
      substances: [],
      entries: [],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }))

    const { result } = renderHook(() => useSubstances())

    await expect(async () => {
      await act(async () => {
        result.current.addSubstance('', 50)
      })
    }).rejects.toThrow('Invalid substance data')

    await expect(async () => {
      await act(async () => {
        result.current.addSubstance('Test', 'invalid')
      })
    }).rejects.toThrow('Invalid substance data')

    await expect(async () => {
      await act(async () => {
        result.current.addSubstance(null, 50)
      })
    }).rejects.toThrow('Invalid substance data')
  })

  it('should trim substance name when adding', async () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({
      substances: [],
      entries: [],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }))

    const { result } = renderHook(() => useSubstances())

    await act(async () => {
      result.current.addSubstance('  Apollo  ', 50)
    })

    await waitFor(() => {
      expect(result.current.substances[0].name).toBe('Apollo')
    })
  })

  it('should update a substance', async () => {
    const mockData = {
      substances: [
        { id: '1', name: 'Test', theoreticalInitialMass: 100, active: true }
      ],
      entries: [],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }

    localStorage.getItem.mockReturnValue(JSON.stringify(mockData))

    const { result } = renderHook(() => useSubstances())

    await waitFor(() => {
      expect(result.current.substances).toHaveLength(1)
    })

    await act(async () => {
      result.current.updateSubstance('1', { name: 'Updated', theoreticalInitialMass: 200 })
    })

    await waitFor(() => {
      expect(result.current.substances[0].name).toBe('Updated')
      expect(result.current.substances[0].theoreticalInitialMass).toBe(200)
    })

    expect(localStorage.setItem).toHaveBeenCalled()
  })

  it('should not update non-existent substance', async () => {
    const mockData = {
      substances: [
        { id: '1', name: 'Test', theoreticalInitialMass: 100, active: true }
      ],
      entries: [],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }

    localStorage.getItem.mockReturnValue(JSON.stringify(mockData))

    const { result } = renderHook(() => useSubstances())

    await waitFor(() => {
      expect(result.current.substances).toHaveLength(1)
    })

    await act(async () => {
      result.current.updateSubstance('999', { name: 'Should Not Update' })
    })

    await waitFor(() => {
      expect(result.current.substances[0].name).toBe('Test')
    })
  })

  it('should delete a substance', async () => {
    const mockData = {
      substances: [
        { id: '1', name: 'Test', theoreticalInitialMass: 100, active: true }
      ],
      entries: [],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }

    localStorage.getItem.mockReturnValue(JSON.stringify(mockData))
    global.confirm.mockReturnValue(true)

    const { result } = renderHook(() => useSubstances())

    await waitFor(() => {
      expect(result.current.substances).toHaveLength(1)
    })

    await act(async () => {
      result.current.deleteSubstance('1')
    })

    await waitFor(() => {
      expect(result.current.substances).toHaveLength(0)
    })

    expect(localStorage.setItem).toHaveBeenCalled()
  })

  it('should not delete substance if user cancels', async () => {
    const mockData = {
      substances: [
        { id: '1', name: 'Test', theoreticalInitialMass: 100, active: true }
      ],
      entries: [],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }

    localStorage.getItem.mockReturnValue(JSON.stringify(mockData))
    global.confirm.mockReturnValue(false)

    const { result } = renderHook(() => useSubstances())

    await waitFor(() => {
      expect(result.current.substances).toHaveLength(1)
    })

    await act(async () => {
      result.current.deleteSubstance('1')
    })

    await waitFor(() => {
      expect(result.current.substances).toHaveLength(1)
    })
  })

  it('should get substance by id', async () => {
    const mockData = {
      substances: [
        { id: '1', name: 'Test1', theoreticalInitialMass: 100, active: true },
        { id: '2', name: 'Test2', theoreticalInitialMass: 200, active: true }
      ],
      entries: [],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }

    localStorage.getItem.mockReturnValue(JSON.stringify(mockData))

    const { result } = renderHook(() => useSubstances())

    await waitFor(() => {
      expect(result.current.substances).toHaveLength(2)
    })

    const substance = result.current.getSubstanceById('2')
    expect(substance).toBeDefined()
    expect(substance.name).toBe('Test2')
  })

  it('should persist to localStorage when adding substance', async () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({
      substances: [],
      entries: [],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }))

    const { result } = renderHook(() => useSubstances())

    await act(async () => {
      result.current.addSubstance('Test', 100)
    })

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'tracker_data',
      expect.stringContaining('Test')
    )
  })
})

describe('useEntries', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should initialize with empty entries array', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({
      substances: [],
      entries: [],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }))

    const { result } = renderHook(() => useEntries())

    expect(result.current.entries).toEqual([])
  })

  it('should load entries from localStorage', async () => {
    const mockData = {
      substances: [],
      entries: [
        {
          id: '1',
          substanceId: 'sub1',
          person: 't',
          initialMass: 50,
          finalMass: 45,
          delta: 5,
          timestamp: new Date().toISOString()
        }
      ],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }

    localStorage.getItem.mockReturnValue(JSON.stringify(mockData))

    const { result } = renderHook(() => useEntries())

    await waitFor(() => {
      expect(result.current.entries).toHaveLength(1)
      expect(result.current.entries[0].person).toBe('t')
    })
  })

  it('should add a new entry', async () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({
      substances: [],
      entries: [],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }))

    const { result } = renderHook(() => useEntries())

    let newEntry
    await act(async () => {
      newEntry = result.current.addEntry('sub1', 't', 50, 45, 'Test note')
    })

    expect(newEntry).toBeDefined()
    expect(newEntry.substanceId).toBe('sub1')
    expect(newEntry.person).toBe('t')
    expect(newEntry.initialMass).toBe(50)
    expect(newEntry.finalMass).toBe(45)
    expect(newEntry.delta).toBe(5)
    expect(newEntry.notes).toBe('Test note')
    expect(newEntry.id).toBeDefined()
    expect(newEntry.timestamp).toBeDefined()

    await waitFor(() => {
      expect(result.current.entries).toHaveLength(1)
    })

    expect(localStorage.setItem).toHaveBeenCalled()
  })

  it('should add entry without notes', async () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({
      substances: [],
      entries: [],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }))

    const { result } = renderHook(() => useEntries())

    let newEntry
    await act(async () => {
      newEntry = result.current.addEntry('sub1', 't', 50, 45)
    })

    expect(newEntry.notes).toBeUndefined()
  })

  it('should throw error when adding entry with invalid data', async () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({
      substances: [],
      entries: [],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }))

    const { result } = renderHook(() => useEntries())

    await expect(async () => {
      await act(async () => {
        result.current.addEntry('', 't', 50, 45)
      })
    }).rejects.toThrow('Invalid entry data')

    await expect(async () => {
      await act(async () => {
        result.current.addEntry('sub1', '', 50, 45)
      })
    }).rejects.toThrow('Invalid entry data')

    await expect(async () => {
      await act(async () => {
        result.current.addEntry('sub1', 't', 'invalid', 45)
      })
    }).rejects.toThrow('Invalid entry data')

    await expect(async () => {
      await act(async () => {
        result.current.addEntry('sub1', 't', 50, 'invalid')
      })
    }).rejects.toThrow('Invalid entry data')
  })

  it('should trim person name when adding entry', async () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({
      substances: [],
      entries: [],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }))

    const { result } = renderHook(() => useEntries())

    await act(async () => {
      result.current.addEntry('sub1', '  t  ', 50, 45)
    })

    await waitFor(() => {
      expect(result.current.entries[0].person).toBe('t')
    })
  })

  it('should calculate delta automatically when adding entry', async () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({
      substances: [],
      entries: [],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }))

    const { result } = renderHook(() => useEntries())

    await act(async () => {
      result.current.addEntry('sub1', 't', 50.5, 45.3)
    })

    await waitFor(() => {
      expect(result.current.entries[0].delta).toBe(5.2)
    })
  })

  it('should add newest entries first', async () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({
      substances: [],
      entries: [],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }))

    const { result } = renderHook(() => useEntries())

    await act(async () => {
      result.current.addEntry('sub1', 't', 50, 45)
    })

    await act(async () => {
      result.current.addEntry('sub1', 's', 40, 35)
    })

    await waitFor(() => {
      expect(result.current.entries).toHaveLength(2)
      expect(result.current.entries[0].person).toBe('s')
      expect(result.current.entries[1].person).toBe('t')
    })
  })

  it('should delete an entry', async () => {
    const mockData = {
      substances: [],
      entries: [
        {
          id: '1',
          substanceId: 'sub1',
          person: 't',
          initialMass: 50,
          finalMass: 45,
          delta: 5,
          timestamp: new Date().toISOString()
        }
      ],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }

    localStorage.getItem.mockReturnValue(JSON.stringify(mockData))
    global.confirm.mockReturnValue(true)

    const { result } = renderHook(() => useEntries())

    await waitFor(() => {
      expect(result.current.entries).toHaveLength(1)
    })

    await act(async () => {
      result.current.deleteEntry('1')
    })

    await waitFor(() => {
      expect(result.current.entries).toHaveLength(0)
    })

    expect(localStorage.setItem).toHaveBeenCalled()
  })

  it('should not delete entry if user cancels', async () => {
    const mockData = {
      substances: [],
      entries: [
        {
          id: '1',
          substanceId: 'sub1',
          person: 't',
          initialMass: 50,
          finalMass: 45,
          delta: 5,
          timestamp: new Date().toISOString()
        }
      ],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }

    localStorage.getItem.mockReturnValue(JSON.stringify(mockData))
    global.confirm.mockReturnValue(false)

    const { result } = renderHook(() => useEntries())

    await waitFor(() => {
      expect(result.current.entries).toHaveLength(1)
    })

    await act(async () => {
      result.current.deleteEntry('1')
    })

    await waitFor(() => {
      expect(result.current.entries).toHaveLength(1)
    })
  })

  it('should update an entry', async () => {
    const mockData = {
      substances: [],
      entries: [
        {
          id: '1',
          substanceId: 'sub1',
          person: 't',
          initialMass: 50,
          finalMass: 45,
          delta: 5,
          timestamp: new Date().toISOString()
        }
      ],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }

    localStorage.getItem.mockReturnValue(JSON.stringify(mockData))

    const { result } = renderHook(() => useEntries())

    await waitFor(() => {
      expect(result.current.entries).toHaveLength(1)
    })

    await act(async () => {
      result.current.updateEntry('1', 60, 50)
    })

    await waitFor(() => {
      expect(result.current.entries[0].initialMass).toBe(60)
      expect(result.current.entries[0].finalMass).toBe(50)
      expect(result.current.entries[0].delta).toBe(10)
    })

    expect(localStorage.setItem).toHaveBeenCalled()
  })

  it('should recalculate delta when updating entry', async () => {
    const mockData = {
      substances: [],
      entries: [
        {
          id: '1',
          substanceId: 'sub1',
          person: 't',
          initialMass: 50,
          finalMass: 45,
          delta: 5,
          timestamp: new Date().toISOString()
        }
      ],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }

    localStorage.getItem.mockReturnValue(JSON.stringify(mockData))

    const { result } = renderHook(() => useEntries())

    await waitFor(() => {
      expect(result.current.entries).toHaveLength(1)
    })

    await act(async () => {
      result.current.updateEntry('1', 100.5, 75.3)
    })

    await waitFor(() => {
      expect(result.current.entries[0].delta).toBe(25.2)
    })
  })

  it('should get entries by substance', async () => {
    const mockData = {
      substances: [],
      entries: [
        { id: '1', substanceId: 'sub1', person: 't', initialMass: 50, finalMass: 45, delta: 5, timestamp: new Date().toISOString() },
        { id: '2', substanceId: 'sub2', person: 't', initialMass: 40, finalMass: 35, delta: 5, timestamp: new Date().toISOString() },
        { id: '3', substanceId: 'sub1', person: 's', initialMass: 30, finalMass: 25, delta: 5, timestamp: new Date().toISOString() }
      ],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }

    localStorage.getItem.mockReturnValue(JSON.stringify(mockData))

    const { result } = renderHook(() => useEntries())

    await waitFor(() => {
      expect(result.current.entries).toHaveLength(3)
    })

    const sub1Entries = result.current.getEntriesBySubstance('sub1')
    expect(sub1Entries).toHaveLength(2)
    expect(sub1Entries.every(e => e.substanceId === 'sub1')).toBe(true)
  })

  it('should get entries by person', async () => {
    const mockData = {
      substances: [],
      entries: [
        { id: '1', substanceId: 'sub1', person: 't', initialMass: 50, finalMass: 45, delta: 5, timestamp: new Date().toISOString() },
        { id: '2', substanceId: 'sub2', person: 's', initialMass: 40, finalMass: 35, delta: 5, timestamp: new Date().toISOString() },
        { id: '3', substanceId: 'sub1', person: 't', initialMass: 30, finalMass: 25, delta: 5, timestamp: new Date().toISOString() }
      ],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }

    localStorage.getItem.mockReturnValue(JSON.stringify(mockData))

    const { result } = renderHook(() => useEntries())

    await waitFor(() => {
      expect(result.current.entries).toHaveLength(3)
    })

    const tEntries = result.current.getEntriesByPerson('t')
    expect(tEntries).toHaveLength(2)
    expect(tEntries.every(e => e.person === 't')).toBe(true)
  })

  it('should get unique people', async () => {
    const mockData = {
      substances: [],
      entries: [
        { id: '1', substanceId: 'sub1', person: 't', initialMass: 50, finalMass: 45, delta: 5, timestamp: new Date().toISOString() },
        { id: '2', substanceId: 'sub2', person: 's', initialMass: 40, finalMass: 35, delta: 5, timestamp: new Date().toISOString() },
        { id: '3', substanceId: 'sub1', person: 't', initialMass: 30, finalMass: 25, delta: 5, timestamp: new Date().toISOString() },
        { id: '4', substanceId: 'sub1', person: 'a', initialMass: 20, finalMass: 15, delta: 5, timestamp: new Date().toISOString() }
      ],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }

    localStorage.getItem.mockReturnValue(JSON.stringify(mockData))

    const { result } = renderHook(() => useEntries())

    await waitFor(() => {
      expect(result.current.entries).toHaveLength(4)
    })

    const people = result.current.getUniquePeople()
    expect(people).toEqual(['a', 's', 't'])
  })

  it('should persist to localStorage when adding entry', async () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({
      substances: [],
      entries: [],
      metadata: { version: '1.0', lastUpdated: new Date().toISOString() }
    }))

    const { result } = renderHook(() => useEntries())

    await act(async () => {
      result.current.addEntry('sub1', 't', 50, 45)
    })

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'tracker_data',
      expect.stringContaining('sub1')
    )
  })
})
