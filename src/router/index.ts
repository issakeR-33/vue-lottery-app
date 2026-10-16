import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
  type RouterHistory,
} from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { checkAccess } from './guards'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    layout?: 'default' | 'auth'
    /** Лише для авторизованих, діє й на вкладені маршрути. */
    requiresAuth?: boolean
    /** Лише для гостей (сторінка логіну). */
    guestOnly?: boolean
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
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'users',
        component: () => import('@/views/UsersView.vue'),
        meta: { title: 'Users' },
      },
      {
        // динамічний сегмент, id передається в компонент як prop
        path: ':id(\\d+)',
        name: 'user',
        component: () => import('@/views/UserDetailsView.vue'),
        props: true,
        meta: { title: 'Профіль учасника' },
        children: [
          {
            // вкладений маршрут рендериться в <RouterView> сторінки учасника
            path: 'edit',
            name: 'user-edit',
            component: () => import('@/views/UserEditView.vue'),
            meta: { title: 'Редагування учасника' },
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Login', layout: 'auth', guestOnly: true },
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
    // зміна лише query (пошук, сторінка списку) не прокручує сторінку вгору
    scrollBehavior: (to, from, savedPosition) =>
      savedPosition ?? (to.path === from.path ? false : { top: 0 }),
  })
}

const APP_NAME = 'Vue Lottery'

export function pageTitle(title?: string): string {
  return title ? `${title} · ${APP_NAME}` : APP_NAME
}

export const router = createAppRouter()

// navigation guard: /users і вкладені сторінки лише після входу, /login лише для гостей
router.beforeEach((to) => checkAccess(to, useAuthStore().isAuthenticated))

// заголовок вкладки береться з meta.title сторінки
router.afterEach((to) => {
  document.title = pageTitle(to.meta.title)
})
