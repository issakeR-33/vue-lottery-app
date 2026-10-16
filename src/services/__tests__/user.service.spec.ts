import { afterEach, describe, expect, it, vi } from 'vitest'
import { UserService } from '../user.service'
import { HttpError } from '@/api/http-client'

function mockFetch(body: unknown, status = 200) {
  const fetchMock = vi.fn(async () => new Response(JSON.stringify(body), { status }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function requestOf(fetchMock: ReturnType<typeof mockFetch>, index = 0) {
  const [url, init] = fetchMock.mock.calls[index] as unknown as [string, RequestInit]
  return { url, init }
}

describe('UserService', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests a page with limit, skip and sorting and maps it to Page', async () => {
    const fetchMock = mockFetch({ users: [{ id: 1 }], total: 208, skip: 20, limit: 10 })

    const page = await new UserService().getAll({
      limit: 10,
      skip: 20,
      sortBy: 'age',
      order: 'desc',
    })

    expect(requestOf(fetchMock).url).toBe(
      'https://api.test/users?limit=10&skip=20&sortBy=age&order=desc',
    )
    expect(page).toEqual({ items: [{ id: 1 }], total: 208, skip: 20, limit: 10 })
  })

  it('searches with an encoded query', async () => {
    const fetchMock = mockFetch({ users: [], total: 0, skip: 0, limit: 10 })

    await new UserService().search('john doe')

    expect(requestOf(fetchMock).url).toBe(
      'https://api.test/users/search?q=john+doe&limit=10&skip=0',
    )
  })

  it('sends JSON for create and update and uses DELETE for delete', async () => {
    const fetchMock = mockFetch({ id: 5 })
    const service = new UserService()

    await service.create({
      firstName: 'Ann',
      lastName: 'Lee',
      email: 'ann@example.com',
      username: 'ann',
      password: 'secret1',
      age: 30,
      gender: 'female',
      phone: '+380501234567',
    })
    await service.update(5, { firstName: 'Anna' })
    await service.delete(5)

    const create = requestOf(fetchMock, 0)
    expect(create.url).toBe('https://api.test/users/add')
    expect(create.init.method).toBe('POST')
    expect(new Headers(create.init.headers).get('Content-Type')).toBe('application/json')

    const update = requestOf(fetchMock, 1)
    expect(update.url).toBe('https://api.test/users/5')
    expect(update.init.method).toBe('PUT')
    expect(JSON.parse(update.init.body as string)).toEqual({ firstName: 'Anna' })

    expect(requestOf(fetchMock, 2).init.method).toBe('DELETE')
  })

  it('throws HttpError with the server message', async () => {
    mockFetch({ message: "User with id '999' not found" }, 404)

    await expect(new UserService().getById(999)).rejects.toEqual(
      new HttpError(404, "User with id '999' not found"),
    )
  })
})
