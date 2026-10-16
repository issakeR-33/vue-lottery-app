import { HttpError } from '@/api/http-client'
import type { Page, PageParams } from '../interfaces'
import type { UserRepository } from '../user.service'
import type { CreateUserDto, UpdateUserDto, User } from '@/types/user'

export function makeUser(id: number, overrides: Partial<User> = {}): User {
  return {
    id,
    firstName: `First${id}`,
    lastName: `Last${id}`,
    age: 20 + id,
    gender: id % 2 ? 'female' : 'male',
    email: `user${id}@example.com`,
    phone: '+380501234567',
    username: `user${id}`,
    ...overrides,
  }
}

// Фейковий репозиторій у пам'яті: компоненти й стори працюють із ним так само, як із UserService
export class FakeUserService implements UserRepository {
  calls: string[] = []

  constructor(public items: User[] = [1, 2, 3].map((id) => makeUser(id))) {}

  private page(list: User[], { limit = 10, skip = 0 }: PageParams = {}): Page<User> {
    return { items: list.slice(skip, skip + limit), total: list.length, skip, limit }
  }

  async getAll(params?: PageParams): Promise<Page<User>> {
    this.calls.push('getAll')
    return this.page(this.items, params)
  }

  async search(query: string, params?: PageParams): Promise<Page<User>> {
    this.calls.push(`search:${query}`)
    const q = query.toLowerCase()
    return this.page(
      this.items.filter((u) => `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)),
      params,
    )
  }

  async getById(id: number): Promise<User> {
    const user = this.items.find((u) => u.id === id)
    if (!user) throw new HttpError(404, `User with id '${id}' not found`)
    return user
  }

  // як і DummyJSON, нічого не змінює в "базі", лише повертає відповідь
  async create(data: CreateUserDto): Promise<User> {
    this.calls.push('create')
    return { id: 209, ...data }
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    this.calls.push(`update:${id}`)
    return { ...(await this.getById(id)), ...data }
  }

  async delete(id: number): Promise<User> {
    this.calls.push(`delete:${id}`)
    return this.getById(id)
  }
}
