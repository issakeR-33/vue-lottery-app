import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { routes } from '../index'
import { checkAccess, safeRedirect } from '../guards'

// той самий список маршрутів, що й у застосунку, але з історією в пам'яті
async function navigate(path: string, isAuthenticated: boolean) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.beforeEach((to) => checkAccess(to, isAuthenticated))
  await router.push(path)
  return router.currentRoute.value
}

describe('navigation guard', () => {
  it('sends a guest from a protected nested page to login with redirect', async () => {
    const route = await navigate('/users/5/edit', false)

    expect(route.name).toBe('login')
    expect(route.query.redirect).toBe('/users/5/edit')
  })

  it('keeps the query of the protected list in redirect', async () => {
    const route = await navigate('/users?page=2&q=john', false)

    expect(route.query.redirect).toBe('/users?page=2&q=john')
  })

  it('lets an authenticated user open the users pages', async () => {
    expect((await navigate('/users/5', true)).name).toBe('user')
  })

  it('sends an authenticated user from login to users', async () => {
    expect((await navigate('/login', true)).name).toBe('users')
  })

  it('leaves public pages and the 404 page open for guests', async () => {
    expect((await navigate('/about', false)).name).toBe('about')
    expect((await navigate('/missing/page', false)).name).toBe('not-found')
  })
})

describe('safeRedirect', () => {
  it('accepts only internal paths', () => {
    expect(safeRedirect('/users?page=2')).toBe('/users?page=2')
    expect(safeRedirect('//evil.example')).toBeNull()
    expect(safeRedirect('https://evil.example')).toBeNull()
    expect(safeRedirect(undefined)).toBeNull()
  })
})
