import type { Router } from 'vue-router'
import { setAuthHooks } from '@/api/http-client'
import type { useAuthStore } from '@/stores/auth'

// Зв'язує http-клієнт зі стором авторизації: клієнт бере звідти токен
// і просить його оновити, а сам про Pinia нічого не знає.
export function installAuthInterceptor(auth: ReturnType<typeof useAuthStore>, router: Router) {
  setAuthHooks({
    getAccessToken: () => auth.accessToken,
    refreshAccessToken: async () => null,
    onSessionExpired: () => {
      auth.logout()
      const current = router.currentRoute.value
      if (current.name !== 'login') {
        router.push({ name: 'login', query: { redirect: current.fullPath } })
      }
    },
  })
}
