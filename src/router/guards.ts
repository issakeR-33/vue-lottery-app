import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'

// Повертає true, якщо перехід дозволено, або маршрут, на який треба перенаправити.
export function checkAccess(
  to: RouteLocationNormalized,
  isAuthenticated: boolean,
): true | RouteLocationRaw {
  // meta вкладених маршрутів (/users/:id/edit) успадковує requiresAuth від /users
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && isAuthenticated) {
    return { name: 'users' }
  }
  return true
}

// приймаємо лише внутрішні шляхи, щоб ?redirect= не вів на сторонній сайт
export function safeRedirect(value: unknown): string | null {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
    ? value
    : null
}
