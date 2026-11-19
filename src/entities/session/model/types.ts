export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

// Профіль, який повертає /auth/login і /auth/me. Слайси одного шару не імпортують один одного,
// тому тип описано тут, а не через Pick<User> з entities/user.
export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: 'male' | 'female'
  image?: string
}

export type LoginResponse = AuthUser & AuthTokens
