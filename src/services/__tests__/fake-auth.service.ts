import { HttpError } from '@/api/http-client'
import type { AuthRepository } from '../auth.service'
import type { AuthTokens, AuthUser, LoginCredentials, LoginResponse } from '@/types/auth'

export const testUser: AuthUser = {
  id: 1,
  username: 'emilys',
  email: 'emily@example.com',
  firstName: 'Emily',
  lastName: 'Johnson',
  gender: 'female',
  image: '',
}

export class FakeAuthService implements AuthRepository {
  calls: string[] = []
  refreshResult: AuthTokens | null = { accessToken: 'access-2', refreshToken: 'refresh-2' }

  async login({ username, password }: LoginCredentials): Promise<LoginResponse> {
    this.calls.push(`login:${username}`)
    if (username !== 'emilys' || password !== 'emilyspass') {
      throw new HttpError(400, 'Invalid credentials')
    }
    return { ...testUser, accessToken: 'access-1', refreshToken: 'refresh-1' }
  }

  async me(): Promise<AuthUser> {
    this.calls.push('me')
    return testUser
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    this.calls.push(`refresh:${refreshToken}`)
    if (!this.refreshResult) throw new HttpError(401, 'Invalid refresh token')
    return this.refreshResult
  }
}
