import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useUsersStore } from '../users'
import { ServiceProvider } from '@/services/service-provider'
import { FakeUserService, makeUser } from '@/services/__tests__/fake-user.service'
import type { Page } from '@/services/interfaces'
import type { CreateUserDto, User } from '@/types/user'

const newUser: CreateUserDto = {
  firstName: 'Ann',
  lastName: 'Lee',
  email: 'ann@example.com',
  username: 'annlee',
  password: 'secret1',
  age: 30,
  gender: 'female',
  phone: '+380501234567',
}

function page(items: User[], skip = 0): Page<User> {
  return { items, total: 100, skip, limit: 10 }
}

describe('users store', () => {
  let service: FakeUserService

  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    service = new FakeUserService()
    ServiceProvider.override({ users: service })
  })

  afterEach(() => {
    ServiceProvider.reset()
  })

  it('keeps a created user locally because the API only simulates POST', async () => {
    const store = useUsersStore()

    const first = await store.createUser(newUser)
    const second = await store.createUser({ ...newUser, username: 'ann2' })

    expect(service.calls).toEqual(['create', 'create'])
    expect([first.id, second.id]).toEqual([209, 210])
    const shown = store.applyLocalChanges(page([makeUser(1)]))
    expect(shown.items.map((u) => u.id)).toEqual([210, 209, 1])
    expect(shown.total).toBe(102)
  })

  it('shows created users only on the first page and only if they match the search', async () => {
    const store = useUsersStore()
    await store.createUser(newUser)

    expect(store.applyLocalChanges(page([], 10)).items).toEqual([])
    expect(store.applyLocalChanges(page([]), 'zzz').items).toEqual([])
    expect(store.applyLocalChanges(page([]), 'ann').items).toHaveLength(1)
  })

  it('replaces an updated user and hides a deleted one in every later page', async () => {
    const store = useUsersStore()

    await store.updateUser(2, { firstName: 'Renamed' })
    await store.deleteUser(3)

    const shown = store.applyLocalChanges(page([makeUser(1), makeUser(2), makeUser(3)]))
    expect(shown.items.map((u) => u.firstName)).toEqual(['First1', 'Renamed'])
    expect(service.calls).toEqual(['update:2', 'delete:3'])
  })

  it('edits and deletes a locally created user without calling the API', async () => {
    const store = useUsersStore()
    const user = await store.createUser(newUser)

    await store.updateUser(user.id, { firstName: 'Annie' })
    expect((await store.getUser(user.id)).firstName).toBe('Annie')

    await store.deleteUser(user.id)
    expect(store.created).toEqual([])
    expect(service.calls).toEqual(['create'])
  })

  it('removes a deleted winner and refreshes an edited one', async () => {
    const store = useUsersStore()
    const pool = [makeUser(1)]
    store.pickWinner(pool)

    await store.updateUser(1, { firstName: 'Winner' })
    expect(store.winners[0]?.firstName).toBe('Winner')

    await store.deleteUser(1)
    expect(store.winners).toEqual([])
  })

  it('persists local changes to localStorage with a deep watcher', async () => {
    const store = useUsersStore()
    await store.deleteUser(1)
    await nextTick()

    const saved = JSON.parse(localStorage.getItem('vue-lottery-local-changes') ?? '{}')
    expect(saved.deletedIds).toEqual([1])
  })
})
