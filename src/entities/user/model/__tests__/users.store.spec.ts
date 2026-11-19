import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp, nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useUsersStore } from '../users.store'
import { ServiceProvider, type Page } from '@/shared/api'
import { USER_SERVICE, type CreateUserDto, type User } from '@/entities/user'
import { FakeUserService, makeUser } from '@/entities/user/api/__tests__/fake-user.service'

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

// плагіни Pinia підключаються лише після app.use(pinia)
function installPinia() {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  createApp({}).use(pinia)
  setActivePinia(pinia)
}

describe('users store', () => {
  let service: FakeUserService

  beforeEach(() => {
    localStorage.clear()
    installPinia()
    service = new FakeUserService(Array.from({ length: 25 }, (_, i) => makeUser(i + 1)))
    ServiceProvider.register(USER_SERVICE, () => service)
  })

  afterEach(() => {
    ServiceProvider.reset()
  })

  it('fetchUsers loads a page and fills users, total and the loading flag', async () => {
    const store = useUsersStore()
    const request = store.fetchUsers({ limit: 10, skip: 10 })
    expect(store.isLoading).toBe(true)
    await request
    expect(store.isLoading).toBe(false)
    expect(store.users.map((u) => u.id)[0]).toBe(11)
    expect(store.total).toBe(25)
  })

  it('fetchUsers keeps the error message when the API fails', async () => {
    service.getAll = async () => {
      throw new Error('HTTP 500: Internal Server Error')
    }
    const store = useUsersStore()
    await store.fetchUsers()
    expect(store.error).toBe('HTTP 500: Internal Server Error')
    expect(store.hasUsers).toBe(false)
  })

  it('shows a created user at the top of the list because the API only simulates POST', async () => {
    const store = useUsersStore()
    await store.fetchUsers({ limit: 10, skip: 0 })
    const first = await store.createUser(newUser)
    const second = await store.createUser({ ...newUser, username: 'ann2' })
    expect([first.id, second.id]).toEqual([209, 210])
    expect(store.users.slice(0, 3).map((u) => u.id)).toEqual([210, 209, 1])
    expect(store.total).toBe(27)
  })

  it('shows created users only on the first page and only if they match the search', async () => {
    const store = useUsersStore()
    await store.createUser(newUser)
    expect(store.applyLocalChanges(page([], 10)).items).toEqual([])
    expect(store.applyLocalChanges(page([]), 'zzz').items).toEqual([])
    expect(store.applyLocalChanges(page([]), 'ann').items).toHaveLength(1)
  })

  it('replaces an updated user and hides a removed one in the state', async () => {
    const store = useUsersStore()
    await store.fetchUsers({ limit: 3, skip: 0 })
    await store.updateUser(2, { firstName: 'Renamed' })
    await store.removeUser(3)
    expect(store.users.map((u) => u.firstName)).toEqual(['First1', 'Renamed'])
    expect(service.calls).toContain('update:2')
    expect(service.calls).toContain('delete:3')
  })

  it('fetchUser sets the current user and keeps local edits', async () => {
    const store = useUsersStore()
    const user = await store.createUser(newUser)
    await store.updateUser(user.id, { firstName: 'Annie' })
    await store.fetchUser(user.id)
    expect(store.current?.firstName).toBe('Annie')
    await store.removeUser(user.id)
    expect(store.current).toBeNull()
    expect(store.created).toEqual([])
  })

  it('persists local changes with pinia-plugin-persistedstate', async () => {
    const store = useUsersStore()
    await store.removeUser(1)
    await nextTick()
    const saved = JSON.parse(localStorage.getItem('vue-lottery-local-changes') ?? '{}')
    expect(saved.deletedIds).toEqual([1])
    // список і прапорці завантаження не зберігаються, лише локальні зміни
    expect(Object.keys(saved).sort()).toEqual(['created', 'deletedIds', 'updated'])
  })
})
