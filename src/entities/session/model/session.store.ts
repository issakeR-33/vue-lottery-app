import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/shared/api'
import { AUTH_SERVICE, type AuthRepository } from '../api/auth.service'
import type { AuthTokens, AuthUser, LoginCredentials } from './types'

const STORAGE_KEY = 'vue-lottery-session'

interface StoredSession extends AuthTokens {
  user: AuthUser
}

function loadSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredSession) : null
  } catch {
    return null
  }
}

function toAuthUser(user: AuthUser): AuthUser {
  const { id, username, email, firstName, lastName, gender, image } = user
  return { id, username, email, firstName, lastName, gender, image }
}

const service = () => ServiceProvider.get<AuthRepository>(AUTH_SERVICE)

// Токени й поточний користувач. Синхронізація з localStorage написана вручну:
// кожна зміна сесії проходить через setSession/clearSession, які й пишуть у сховище.
// Для порівняння, users.store та settings.store зберігаються плагіном pinia-plugin-persistedstate.
export const useSessionStore = defineStore('session', () => {
  const saved = loadSession()
  const user = ref<AuthUser | null>(saved?.user ?? null)
  const accessToken = ref<string | null>(saved?.accessToken ?? null)
  const refreshToken = ref<string | null>(saved?.refreshToken ?? null)

  const isAuthenticated = computed(() => accessToken.value !== null)

  function persist(): void {
    if (user.value && accessToken.value && refreshToken.value) {
      const session: StoredSession = {
        user: user.value,
        accessToken: accessToken.value,
        refreshToken: refreshToken.value,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    }
  }

  function setSession(tokens: AuthTokens, profile?: AuthUser): void {
    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
    if (profile) user.value = toAuthUser(profile)
    persist()
  }

  function clearSession(): void {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    const { accessToken, refreshToken, ...profile } = await service().login(credentials)
    setSession({ accessToken, refreshToken }, profile)
  }

  // GET /auth/me з заголовком Authorization: Bearer перевіряє, що збережений токен ще дійсний
  async function fetchMe(): Promise<void> {
    if (!isAuthenticated.value) return
    const me = await service().me()
    if (isAuthenticated.value) {
      user.value = toAuthUser(me)
      persist()
    }
  }

  // повертає новий accessToken або null, якщо refreshToken теж недійсний
  async function refresh(): Promise<string | null> {
    const token = refreshToken.value
    if (!token) return null
    try {
      const tokens = await service().refresh(token)
      if (!isAuthenticated.value) return null
      setSession(tokens)
      return tokens.accessToken
    } catch {
      return null
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    setSession,
    clearSession,
    login,
    fetchMe,
    refresh,
  }
})
