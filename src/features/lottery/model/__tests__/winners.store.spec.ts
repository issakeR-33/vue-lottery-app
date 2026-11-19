import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useWinnersStore } from '../winners.store'
import { makeUser } from '@/entities/user/api/__tests__/fake-user.service'

describe('winners store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('picks at most three different winners', () => {
    const store = useWinnersStore()
    const pool = [1, 2, 3, 4, 5].map((id) => makeUser(id))
    for (let i = 0; i < 5; i++) store.pick(pool)
    expect(store.winners).toHaveLength(3)
    expect(new Set(store.winners.map((w) => w.id)).size).toBe(3)
    expect(store.canPick(pool)).toBe(false)
  })

  it('cannot pick when everyone on the page already won', () => {
    const store = useWinnersStore()
    const pool = [makeUser(1)]
    store.pick(pool)
    expect(store.canPick(pool)).toBe(false)
    expect(store.canPick([])).toBe(false)
  })

  it('removes a winner and refreshes an edited one', () => {
    const store = useWinnersStore()
    store.pick([makeUser(1)])
    store.sync(makeUser(1, { firstName: 'Winner' }))
    expect(store.winners[0]?.firstName).toBe('Winner')
    store.remove(1)
    expect(store.winners).toEqual([])
  })
})
