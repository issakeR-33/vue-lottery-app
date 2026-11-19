import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSessionStore } from '../session.store'
import { ServiceProvider } from '@/shared/api'
import { AUTH_SERVICE } from '@/entities/session'
import { FakeAuthService } from '@/entities/session/api/__tests__/fake-auth.service'

const STORAGE_KEY = 'vue-lottery-session'

describe('session store', () => {
  let service: FakeAuthService

  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    service = new FakeAuthService()
    ServiceProvider.register(AUTH_SERVICE, () => service)
  })

  afterEach(() => {
    ServiceProvider.reset()
  })

  it('logs in and keeps the tokens and the user in localStorage', async () => {
    const session = useSessionStore()
    await session.login({ username: 'emilys', password: 'emilyspass' })
    expect(session.isAuthenticated).toBe(true)
    expect(session.user?.firstName).toBe('Emily')
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toMatchObject({
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
    })
  })

  it('restores the session after a reload', async () => {
    await useSessionStore().login({ username: 'emilys', password: 'emilyspass' })
    setActivePinia(createPinia())
    const restored = useSessionStore()
    expect(restored.isAuthenticated).toBe(true)
    expect(restored.accessToken).toBe('access-1')
  })

  it('stays logged out after wrong credentials', async () => {
    const session = useSessionStore()
    await expect(session.login({ username: 'emilys', password: 'nope12' })).rejects.toThrow(
      'Invalid credentials',
    )
    expect(session.isAuthenticated).toBe(false)
  })

  it('refresh stores the new pair of tokens', async () => {
    const session = useSessionStore()
    await session.login({ username: 'emilys', password: 'emilyspass' })
    expect(await session.refresh()).toBe('access-2')
    expect(session.refreshToken).toBe('refresh-2')
    expect(service.calls).toContain('refresh:refresh-1')
  })

  it('clearSession removes the tokens from the store and localStorage', async () => {
    const session = useSessionStore()
    await session.login({ username: 'emilys', password: 'emilyspass' })
    session.clearSession()
    expect(session.accessToken).toBeNull()
    expect(session.isAuthenticated).toBe(false)
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
