import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
  type RouterHistory,
} from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    layout?: 'default' | 'auth'
  }
}

// сторінки завантажуються ліниво, кожна потрапляє в окремий чанк
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Home' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'About author' },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/UsersView.vue'),
    meta: { title: 'Users' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Сторінку не знайдено' },
  },
]

export function createAppRouter(history: RouterHistory = createWebHashHistory()) {
  return createRouter({
    history,
    routes,
    scrollBehavior: () => ({ top: 0 }),
  })
}

const APP_NAME = 'Vue Lottery'

export function pageTitle(title?: string): string {
  return title ? `${title} · ${APP_NAME}` : APP_NAME
}

export const router = createAppRouter()

// заголовок вкладки береться з meta.title сторінки
router.afterEach((to) => {
  document.title = pageTitle(to.meta.title)
})
