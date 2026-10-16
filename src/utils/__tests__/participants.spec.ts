import { describe, expect, it } from 'vitest'
import type { Participant } from '../../types/Participant'
import { filterByName, nextParticipantId, sortParticipants } from '../participants'

function participant(id: number, name: string, dob: string): Participant {
  return { id, name, dob, email: `p${id}@example.com`, phone: '+380501234567' }
}

const list: Participant[] = [
  participant(1, 'Іван', '1999-03-01'),
  participant(2, 'Андрій', '2001-07-15'),
  participant(3, 'Богдана', '1995-11-30'),
  participant(4, 'андрій', '1990-01-01'),
]

describe('filterByName', () => {
  it('matches a substring ignoring case and surrounding spaces', () => {
    expect(filterByName(list, '  АНДР ').map((p) => p.id)).toEqual([2, 4])
  })

  it('returns everyone for an empty query', () => {
    expect(filterByName(list, '')).toHaveLength(list.length)
  })
})

describe('sortParticipants', () => {
  it('sorts by name in both directions', () => {
    expect(sortParticipants(list, 'name', 'asc').map((p) => p.name)).toEqual([
      'андрій',
      'Андрій',
      'Богдана',
      'Іван',
    ])
    expect(sortParticipants(list, 'name', 'desc')[0]?.name).toBe('Іван')
  })

  it('sorts by date of birth in both directions', () => {
    expect(sortParticipants(list, 'dob', 'asc').map((p) => p.id)).toEqual([4, 3, 1, 2])
    expect(sortParticipants(list, 'dob', 'desc').map((p) => p.id)).toEqual([2, 1, 3, 4])
  })

  it('does not mutate the source list', () => {
    const before = list.map((p) => p.id)
    sortParticipants(list, 'dob', 'desc')
    expect(list.map((p) => p.id)).toEqual(before)
  })

  it('keeps the original order without a sort key', () => {
    expect(sortParticipants(list, null, 'desc').map((p) => p.id)).toEqual([1, 2, 3, 4])
  })
})

describe('nextParticipantId', () => {
  it('returns one more than the largest id', () => {
    expect(nextParticipantId(list)).toBe(5)
    expect(nextParticipantId([])).toBe(1)
  })
})
