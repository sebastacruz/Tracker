import { describe, it, expect } from 'vitest'
import {
  calculateDelta,
  calculateRemaining,
  getSubstancDeltas,
  getSubstanceRemaining,
  getTotalUsage,
  formatMass,
  formatTimestamp,
  getEntriesByDateRange,
  getEntriesBySubstance,
  getEntriesByPerson,
  getUniquePeople,
  getSubstanceStats,
  getUsageRate,
  getProjectedDepletion,
} from '../../src/utils/calculations'

describe('calculateDelta', () => {
  it('should calculate delta correctly for valid numbers', () => {
    expect(calculateDelta(50.5, 48.3)).toBe(2.2)
    expect(calculateDelta(100, 75)).toBe(25)
    expect(calculateDelta(1.5, 0.5)).toBe(1)
  })

  it('should return 0 for invalid inputs', () => {
    expect(calculateDelta('50', 48)).toBe(0)
    expect(calculateDelta(50, '48')).toBe(0)
    expect(calculateDelta(null, 48)).toBe(0)
    expect(calculateDelta(50, null)).toBe(0)
    expect(calculateDelta(undefined, 48)).toBe(0)
  })

  it('should handle zero values', () => {
    expect(calculateDelta(0, 0)).toBe(0)
    expect(calculateDelta(10, 0)).toBe(10)
    expect(calculateDelta(0, 10)).toBe(-10)
  })

  it('should handle negative deltas', () => {
    expect(calculateDelta(48, 50)).toBe(-2)
  })

  it('should round to 2 decimal places', () => {
    expect(calculateDelta(10.555, 5.333)).toBe(5.22)
    expect(calculateDelta(1.111, 0.999)).toBe(0.11)
  })

  it('should handle very large numbers', () => {
    expect(calculateDelta(1000000, 999999)).toBe(1)
    expect(calculateDelta(999999.99, 999998.99)).toBe(1)
  })

  it('should handle very small numbers', () => {
    expect(calculateDelta(0.01, 0.005)).toBe(0.01)
    expect(calculateDelta(0.001, 0.0005)).toBe(0)
  })
})

describe('calculateRemaining', () => {
  it('should calculate remaining mass correctly', () => {
    expect(calculateRemaining(100, [10, 20, 30])).toBe(40)
    expect(calculateRemaining(50.5, [5.5, 10.0, 15.0])).toBe(20)
  })

  it('should return theoretical mass when no deltas', () => {
    expect(calculateRemaining(100, [])).toBe(100)
    expect(calculateRemaining(50.5, null)).toBe(50.5)
    expect(calculateRemaining(75, undefined)).toBe(75)
  })

  it('should return 0 for invalid theoretical mass', () => {
    expect(calculateRemaining('100', [10, 20])).toBe(0)
    expect(calculateRemaining(null, [10, 20])).toBe(0)
    expect(calculateRemaining(undefined, [10, 20])).toBe(0)
  })

  it('should handle deltas with null/undefined values', () => {
    expect(calculateRemaining(100, [10, null, 20, undefined])).toBe(70)
  })

  it('should handle negative remaining values', () => {
    expect(calculateRemaining(10, [5, 10, 20])).toBe(-25)
  })

  it('should round to 2 decimal places', () => {
    expect(calculateRemaining(10.555, [3.333, 2.111])).toBe(5.11)
  })

  it('should handle zero values', () => {
    expect(calculateRemaining(0, [])).toBe(0)
    expect(calculateRemaining(100, [0, 0, 0])).toBe(100)
  })

  it('should handle very large deltas array', () => {
    const deltas = Array(1000).fill(0.01)
    expect(calculateRemaining(100, deltas)).toBe(90)
  })
})

describe('getSubstancDeltas', () => {
  const entries = [
    { substanceId: 'sub1', delta: 5 },
    { substanceId: 'sub2', delta: 10 },
    { substanceId: 'sub1', delta: 3 },
    { substanceId: 'sub1', delta: null },
  ]

  it('should return all deltas for a substance', () => {
    const deltas = getSubstancDeltas('sub1', entries)
    expect(deltas).toEqual([5, 3, 0])
  })

  it('should return empty array for unknown substance', () => {
    expect(getSubstancDeltas('unknown', entries)).toEqual([])
  })

  it('should handle empty entries array', () => {
    expect(getSubstancDeltas('sub1', [])).toEqual([])
  })

  it('should convert null/undefined deltas to 0', () => {
    const deltas = getSubstancDeltas('sub1', entries)
    expect(deltas.includes(0)).toBe(true)
  })
})

describe('getSubstanceRemaining', () => {
  const substance = {
    id: 'sub1',
    name: 'Test',
    theoreticalInitialMass: 100,
  }

  const entries = [
    { substanceId: 'sub1', delta: 10 },
    { substanceId: 'sub1', delta: 20 },
    { substanceId: 'sub2', delta: 30 },
  ]

  it('should calculate remaining mass for substance', () => {
    expect(getSubstanceRemaining(substance, entries)).toBe(70)
  })

  it('should return theoretical mass when no entries', () => {
    expect(getSubstanceRemaining(substance, [])).toBe(100)
  })

  it('should ignore entries from other substances', () => {
    const result = getSubstanceRemaining(substance, entries)
    expect(result).toBe(70)
  })
})

describe('getTotalUsage', () => {
  const entries = [
    { substanceId: 'sub1', delta: 5 },
    { substanceId: 'sub2', delta: 10 },
    { substanceId: 'sub1', delta: 3 },
    { substanceId: 'sub1', delta: null },
  ]

  it('should calculate total usage for substance', () => {
    expect(getTotalUsage('sub1', entries)).toBe(8)
  })

  it('should return 0 for unknown substance', () => {
    expect(getTotalUsage('unknown', entries)).toBe(0)
  })

  it('should handle empty entries', () => {
    expect(getTotalUsage('sub1', [])).toBe(0)
  })

  it('should handle null/undefined deltas', () => {
    const total = getTotalUsage('sub1', entries)
    expect(total).toBe(8)
  })
})

describe('formatMass', () => {
  it('should format mass to 2 decimal places by default', () => {
    expect(formatMass(10.555)).toBe('10.56')
    expect(formatMass(5.123)).toBe('5.12')
  })

  it('should format to specified decimal places', () => {
    expect(formatMass(10.555, 1)).toBe('10.6')
    expect(formatMass(10.555, 3)).toBe('10.555')
    expect(formatMass(10.555, 0)).toBe('11')
  })

  it('should handle zero', () => {
    expect(formatMass(0)).toBe('0.00')
    expect(formatMass(0, 3)).toBe('0.000')
  })

  it('should handle negative numbers', () => {
    expect(formatMass(-5.555)).toBe('-5.56')
  })

  it('should handle very large numbers', () => {
    expect(formatMass(1000000)).toBe('1000000.00')
  })

  it('should handle very small numbers', () => {
    expect(formatMass(0.001)).toBe('0.00')
    expect(formatMass(0.001, 3)).toBe('0.001')
  })
})

describe('formatTimestamp', () => {
  it('should format ISO timestamp correctly', () => {
    const timestamp = '2024-01-15T14:30:45.000Z'
    const result = formatTimestamp(timestamp)

    expect(result).toHaveProperty('date')
    expect(result).toHaveProperty('time')
    expect(result).toHaveProperty('full')
    expect(result.date).toBe('2024-01-15')
  })

  it('should handle different timestamp formats', () => {
    const timestamp = new Date('2024-06-20').toISOString()
    const result = formatTimestamp(timestamp)

    expect(result.date).toBe('2024-06-20')
  })
})

describe('getEntriesByDateRange', () => {
  const entries = [
    { timestamp: '2024-01-10T10:00:00Z' },
    { timestamp: '2024-01-15T10:00:00Z' },
    { timestamp: '2024-01-20T10:00:00Z' },
    { timestamp: '2024-01-25T10:00:00Z' },
  ]

  it('should filter entries within date range', () => {
    const start = new Date('2024-01-12')
    const end = new Date('2024-01-22')
    const result = getEntriesByDateRange(entries, start, end)

    expect(result).toHaveLength(2)
    expect(result[0].timestamp).toBe('2024-01-15T10:00:00Z')
    expect(result[1].timestamp).toBe('2024-01-20T10:00:00Z')
  })

  it('should include boundary dates', () => {
    const start = new Date('2024-01-15')
    const end = new Date('2024-01-20')
    const result = getEntriesByDateRange(entries, start, end)

    expect(result).toHaveLength(2)
  })

  it('should return empty array when no matches', () => {
    const start = new Date('2024-02-01')
    const end = new Date('2024-02-28')
    const result = getEntriesByDateRange(entries, start, end)

    expect(result).toEqual([])
  })

  it('should handle empty entries array', () => {
    const start = new Date('2024-01-01')
    const end = new Date('2024-01-31')
    const result = getEntriesByDateRange([], start, end)

    expect(result).toEqual([])
  })
})

describe('getEntriesBySubstance', () => {
  const entries = [
    { substanceId: 'sub1', delta: 5 },
    { substanceId: 'sub2', delta: 10 },
    { substanceId: 'sub1', delta: 3 },
  ]

  it('should filter entries by substance ID', () => {
    const result = getEntriesBySubstance(entries, 'sub1')
    expect(result).toHaveLength(2)
    expect(result.every(e => e.substanceId === 'sub1')).toBe(true)
  })

  it('should return empty array for unknown substance', () => {
    expect(getEntriesBySubstance(entries, 'unknown')).toEqual([])
  })

  it('should handle empty entries array', () => {
    expect(getEntriesBySubstance([], 'sub1')).toEqual([])
  })
})

describe('getEntriesByPerson', () => {
  const entries = [
    { person: 't', delta: 5 },
    { person: 's', delta: 10 },
    { person: 't', delta: 3 },
  ]

  it('should filter entries by person', () => {
    const result = getEntriesByPerson(entries, 't')
    expect(result).toHaveLength(2)
    expect(result.every(e => e.person === 't')).toBe(true)
  })

  it('should return empty array for unknown person', () => {
    expect(getEntriesByPerson(entries, 'x')).toEqual([])
  })

  it('should handle empty entries array', () => {
    expect(getEntriesByPerson([], 't')).toEqual([])
  })
})

describe('getUniquePeople', () => {
  it('should return unique sorted people', () => {
    const entries = [
      { person: 't' },
      { person: 's' },
      { person: 't' },
      { person: 'a' },
    ]

    const result = getUniquePeople(entries)
    expect(result).toEqual(['a', 's', 't'])
  })

  it('should handle empty entries', () => {
    expect(getUniquePeople([])).toEqual([])
  })

  it('should handle single person', () => {
    const entries = [{ person: 't' }, { person: 't' }]
    expect(getUniquePeople(entries)).toEqual(['t'])
  })
})

describe('getSubstanceStats', () => {
  const substance = {
    id: 'sub1',
    name: 'Test',
    theoreticalInitialMass: 100,
  }

  const entries = [
    { substanceId: 'sub1', delta: 10 },
    { substanceId: 'sub1', delta: 20 },
    { substanceId: 'sub1', delta: 15 },
    { substanceId: 'sub2', delta: 30 },
  ]

  it('should calculate complete statistics', () => {
    const stats = getSubstanceStats(substance, entries)

    expect(stats.totalEntries).toBe(3)
    expect(stats.totalUsed).toBe(45)
    expect(stats.remaining).toBe(55)
    expect(stats.averageUsage).toBe(15)
    expect(stats.lastEntry).toBeDefined()
  })

  it('should handle substance with no entries', () => {
    const stats = getSubstanceStats(substance, [])

    expect(stats.totalEntries).toBe(0)
    expect(stats.totalUsed).toBe(0)
    expect(stats.remaining).toBe(100)
    expect(stats.averageUsage).toBe(0)
    expect(stats.lastEntry).toBe(null)
  })

  it('should ignore entries from other substances', () => {
    const stats = getSubstanceStats(substance, entries)
    expect(stats.totalEntries).toBe(3)
  })

  it('should round values to 2 decimal places', () => {
    const entriesWithDecimals = [
      { substanceId: 'sub1', delta: 10.555 },
      { substanceId: 'sub1', delta: 20.333 },
      { substanceId: 'sub1', delta: 15.111 },
    ]

    const stats = getSubstanceStats(substance, entriesWithDecimals)
    expect(stats.totalUsed).toBe(46)
    expect(stats.averageUsage).toBe(15.33)
  })
})

describe('getUsageRate', () => {
  const substance = {
    id: 'sub1',
    name: 'Test',
  }

  it('should calculate usage rate correctly', () => {
    const entries = [
      { substanceId: 'sub1', delta: 10, timestamp: '2024-01-01T10:00:00Z' },
      { substanceId: 'sub1', delta: 20, timestamp: '2024-01-11T10:00:00Z' },
    ]

    const rate = getUsageRate(substance, entries)
    expect(rate).toBe(3)
  })

  it('should return 0 when less than 2 entries', () => {
    const entries = [
      { substanceId: 'sub1', delta: 10, timestamp: '2024-01-01T10:00:00Z' },
    ]

    expect(getUsageRate(substance, entries)).toBe(0)
    expect(getUsageRate(substance, [])).toBe(0)
  })

  it('should return 0 when all entries on same day', () => {
    const entries = [
      { substanceId: 'sub1', delta: 10, timestamp: '2024-01-01T10:00:00Z' },
      { substanceId: 'sub1', delta: 20, timestamp: '2024-01-01T14:00:00Z' },
    ]

    expect(getUsageRate(substance, entries)).toBe(0)
  })

  it('should ignore entries from other substances', () => {
    const entries = [
      { substanceId: 'sub1', delta: 10, timestamp: '2024-01-01T10:00:00Z' },
      { substanceId: 'sub2', delta: 100, timestamp: '2024-01-05T10:00:00Z' },
      { substanceId: 'sub1', delta: 20, timestamp: '2024-01-11T10:00:00Z' },
    ]

    const rate = getUsageRate(substance, entries)
    expect(rate).toBe(3)
  })

  it('should round to 3 decimal places', () => {
    const entries = [
      { substanceId: 'sub1', delta: 10.555, timestamp: '2024-01-01T10:00:00Z' },
      { substanceId: 'sub1', delta: 20.333, timestamp: '2024-01-04T10:00:00Z' },
    ]

    const rate = getUsageRate(substance, entries)
    expect(rate).toBeCloseTo(10.296, 3)
  })
})

describe('getProjectedDepletion', () => {
  const substance = {
    id: 'sub1',
    name: 'Test',
    theoreticalInitialMass: 100,
  }

  it('should calculate projected depletion date', () => {
    const entries = [
      { substanceId: 'sub1', delta: 10, timestamp: '2024-01-01T10:00:00Z' },
      { substanceId: 'sub1', delta: 10, timestamp: '2024-01-11T10:00:00Z' },
    ]

    const result = getProjectedDepletion(substance, entries)

    expect(result.depleted).toBe(false)
    expect(result.daysRemaining).toBeGreaterThan(0)
    expect(result.date).toBeInstanceOf(Date)
  })

  it('should indicate when already depleted', () => {
    const entries = [
      { substanceId: 'sub1', delta: 50, timestamp: '2024-01-01T10:00:00Z' },
      { substanceId: 'sub1', delta: 60, timestamp: '2024-01-11T10:00:00Z' },
    ]

    const result = getProjectedDepletion(substance, entries)

    expect(result.depleted).toBe(true)
    expect(result.daysRemaining).toBe(0)
    expect(result.date).toBe(null)
  })

  it('should return null when insufficient data', () => {
    const entries = [
      { substanceId: 'sub1', delta: 10, timestamp: '2024-01-01T10:00:00Z' },
    ]

    const result = getProjectedDepletion(substance, entries)

    expect(result.depleted).toBe(false)
    expect(result.daysRemaining).toBe(null)
    expect(result.date).toBe(null)
  })

  it('should return null when usage rate is 0', () => {
    const entries = [
      { substanceId: 'sub1', delta: 10, timestamp: '2024-01-01T10:00:00Z' },
      { substanceId: 'sub1', delta: 10, timestamp: '2024-01-01T14:00:00Z' },
    ]

    const result = getProjectedDepletion(substance, entries)

    expect(result.depleted).toBe(false)
    expect(result.daysRemaining).toBe(null)
    expect(result.date).toBe(null)
  })

  it('should ceil days remaining', () => {
    const entries = [
      { substanceId: 'sub1', delta: 5, timestamp: '2024-01-01T10:00:00Z' },
      { substanceId: 'sub1', delta: 5, timestamp: '2024-01-11T10:00:00Z' },
    ]

    const result = getProjectedDepletion(substance, entries)
    expect(Number.isInteger(result.daysRemaining)).toBe(true)
  })
})
