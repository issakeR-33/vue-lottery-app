import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { http, setAuthHooks, type AuthHooks } from '../http-client'

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status })
}

function authHeader(call: unknown[]) {
  return new Headers((call[1] as RequestInit).headers).get('Authorization')
}

describe('http client interceptor', () => {
  let token: string
  let refreshAccessToken: Mock<() => Promise<string | null>>
  let onSessionExpired: Mock<() => void>
  let hooks: AuthHooks

  beforeEach(() => {
    token = 'expired'
    refreshAccessToken = vi.fn(async () => {
      token = 'fresh'
      return token
    })
    onSessionExpired = vi.fn()
    hooks = { getAccessToken: () => token, refreshAccessToken, onSessionExpired }
    setAuthHooks(hooks)
  })

  afterEach(() => {
    setAuthHooks(null)
    vi.unstubAllGlobals()
  })

  it('does not send the token to public endpoints', async () => {
    const fetchMock = vi.fn(async () => json({ ok: true }))
    vi.stubGlobal('fetch', fetchMock)

    await http('/users')

    expect(authHeader(fetchMock.mock.calls[0]!)).toBeNull()
  })

  it('refreshes the access token on 401 and retries the request once', async () => {
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) =>
      new Headers(init?.headers).get('Authorization') === 'Bearer fresh'
        ? json({ id: 1 })
        : json({ message: 'Token Expired!' }, 401),
    )
    vi.stubGlobal('fetch', fetchMock)

    const me = await http<{ id: number }>('/auth/me', { auth: true })

    expect(me).toEqual({ id: 1 })
    expect(refreshAccessToken).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls.map(authHeader)).toEqual(['Bearer expired', 'Bearer fresh'])
    expect(onSessionExpired).not.toHaveBeenCalled()
  })

  it('shares one refresh between parallel requests', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, init?: RequestInit) =>
        new Headers(init?.headers).get('Authorization') === 'Bearer fresh'
          ? json({})
          : json({}, 401),
      ),
    )

    await Promise.all([http('/auth/me', { auth: true }), http('/auth/me', { auth: true })])

    expect(refreshAccessToken).toHaveBeenCalledTimes(1)
  })

  it('ends the session when the refresh token is rejected too', async () => {
    refreshAccessToken.mockResolvedValue(null)
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => json({ message: 'Token Expired!' }, 401)),
    )

    await expect(http('/auth/me', { auth: true })).rejects.toThrow('Token Expired!')
    expect(onSessionExpired).toHaveBeenCalledTimes(1)
  })
})
