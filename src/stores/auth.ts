import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { ServiceProvider } from '@/services/service-provider'
import type { AuthUser, LoginCredentials } from '@/types/auth'

const STORAGE_KEY = 'vue-lottery-auth'

interface Session {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

function toAuthUser(user: AuthUser): AuthUser {
  const { id, username, email, firstName, lastName, gender, image } = user
  return { id, username, email, firstName, lastName, gender, image }
}

// Токени й дані користувача живуть у сторі та дублюються в localStorage,
// щоб сесія переживала перезавантаження сторінки.
export const useAuthStore = defineStore('auth', () => {
  const session = ref<Session | null>(loadSession())

  const user = computed(() => session.value?.user ?? null)
  const accessToken = computed(() => session.value?.accessToken ?? null)
  const isAuthenticated = computed(() => session.value !== null)

  watch(
    session,
    (value) => {
      if (value) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    },
    { deep: true },
  )

  async function login(credentials: LoginCredentials): Promise<void> {
    const { accessToken, refreshToken, ...profile } = await ServiceProvider.auth.login(credentials)
    session.value = { user: toAuthUser(profile), accessToken, refreshToken }
  }

  // GET /auth/me з заголовком Authorization: Bearer перевіряє, що збережений токен ще дійсний
  async function fetchMe(): Promise<void> {
    if (!session.value) return
    const me = await ServiceProvider.auth.me()
    if (session.value) {
      session.value.user = toAuthUser(me)
    }
  }

  // повертає новий accessToken або null, якщо refreshToken теж недійсний
  async function refresh(): Promise<string | null> {
    const refreshToken = session.value?.refreshToken
    if (!refreshToken) return null
    try {
      const tokens = await ServiceProvider.auth.refresh(refreshToken)
      if (!session.value) return null
      session.value.accessToken = tokens.accessToken
      session.value.refreshToken = tokens.refreshToken
      return tokens.accessToken
    } catch {
      return null
    }
  }

  function logout(): void {
    session.value = null
  }

  return { session, user, accessToken, isAuthenticated, login, fetchMe, refresh, logout }
})
