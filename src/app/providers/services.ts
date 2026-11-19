import { ServiceProvider } from '@/shared/api'
import { USER_SERVICE, UserService } from '@/entities/user'
import { AUTH_SERVICE, AuthService } from '@/entities/session'

// Конкретні сервіси реєструються на рівні app: лише цей шар може імпортувати всі інші
export function registerServices(): void {
  ServiceProvider.register(USER_SERVICE, () => new UserService())
  ServiceProvider.register(AUTH_SERVICE, () => new AuthService())
}
