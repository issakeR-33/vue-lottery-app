import { http } from '@/shared/api'
import { TOKEN_TTL_MINUTES } from '@/shared/config'
import type { AuthTokens, AuthUser, LoginCredentials, LoginResponse } from '@/entities/session'

// ключ, під яким сервіс реєструється в ServiceProvider
export const AUTH_SERVICE = 'auth'

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<LoginResponse>
  me(): Promise<AuthUser>
  refresh(refreshToken: string): Promise<AuthTokens>
}

export class AuthService implements AuthRepository {
  login(credentials: LoginCredentials): Promise<LoginResponse> {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...credentials, expiresInMins: TOKEN_TTL_MINUTES }),
    })
  }

  // захищений ендпоїнт: http-клієнт додасть Authorization: Bearer
  me(): Promise<AuthUser> {
    return http<AuthUser>('/auth/me', { auth: true })
  }

  refresh(refreshToken: string): Promise<AuthTokens> {
    return http<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken, expiresInMins: TOKEN_TTL_MINUTES }),
    })
  }
}
