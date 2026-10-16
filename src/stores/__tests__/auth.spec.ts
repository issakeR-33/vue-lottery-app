import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../auth'
import { ServiceProvider } from '@/services/service-provider'
import { FakeAuthService } from '@/services/__tests__/fake-auth.service'

const STORAGE_KEY = 'vue-lottery-auth'

describe('auth store', () => {
  let service: FakeAuthService

  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    service = new FakeAuthService()
    ServiceProvider.override({ auth: service })
  })

  afterEach(() => {
    ServiceProvider.reset()
  })

  it('logs in and keeps the tokens and the user in localStorage', async () => {
    const auth = useAuthStore()

    await auth.login({ username: 'emilys', password: 'emilyspass' })
    await nextTick()

    expect(auth.isAuthenticated).toBe(true)
    expect(auth.user?.firstName).toBe('Emily')
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toMatchObject({
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
    })
  })

  it('restores the session after a reload', async () => {
    const first = useAuthStore()
    await first.login({ username: 'emilys', password: 'emilyspass' })
    await nextTick()

    setActivePinia(createPinia())
    const restored = useAuthStore()

    expect(restored.isAuthenticated).toBe(true)
    expect(restored.accessToken).toBe('access-1')
  })

  it('stays logged out after wrong credentials', async () => {
    const auth = useAuthStore()

    await expect(auth.login({ username: 'emilys', password: 'nope12' })).rejects.toThrow(
      'Invalid credentials',
    )
    expect(auth.isAuthenticated).toBe(false)
  })

  it('logout clears the tokens', async () => {
    const auth = useAuthStore()
    await auth.login({ username: 'emilys', password: 'emilyspass' })

    auth.logout()
    await nextTick()

    expect(auth.accessToken).toBeNull()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
