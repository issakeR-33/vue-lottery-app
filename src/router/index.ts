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

// заголовок вкладки береться з meta.title сторінки
router.afterEach((to) => {
  document.title = pageTitle(to.meta.title)
})
