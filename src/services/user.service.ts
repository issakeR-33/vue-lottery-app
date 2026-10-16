import { http, toQueryString } from '@/api/http-client'
import type { CreateUserDto, UpdateUserDto, User } from '@/types/user'
import type {
  Creatable,
  Deletable,
  Editable,
  Page,
  PageParams,
  Readable,
  Searchable,
} from './interfaces'

interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

export type UserRepository = Readable<User> &
  Searchable<User> &
  Creatable<User, CreateUserDto> &
  Editable<User, UpdateUserDto> &
  Deletable<User>

function toPage({ users, total, skip, limit }: UsersResponse): Page<User> {
  return { items: users, total, skip, limit }
}

export class UserService implements UserRepository {
  async getAll({ limit = 10, skip = 0, sortBy, order }: PageParams = {}): Promise<Page<User>> {
    const query = toQueryString({ limit, skip, sortBy, order })
    return toPage(await http<UsersResponse>(`/users${query}`))
  }

  async search(
    q: string,
    { limit = 10, skip = 0, sortBy, order }: PageParams = {},
  ): Promise<Page<User>> {
    const query = toQueryString({ q, limit, skip, sortBy, order })
    return toPage(await http<UsersResponse>(`/users/search${query}`))
  }

  getById(id: number): Promise<User> {
    return http<User>(`/users/${id}`)
  }

  create(data: CreateUserDto): Promise<User> {
    return http<User>('/users/add', { method: 'POST', body: JSON.stringify(data) })
  }

  update(id: number, data: UpdateUserDto): Promise<User> {
    return http<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  }

  delete(id: number): Promise<User> {
    return http<User>(`/users/${id}`, { method: 'DELETE' })
  }
}
