# Vue Lottery: маршрутизація, REST API, JWT, Repository

Лабораторна робота №5 з курсу «Інженерія клієнтських веб-систем», гілка `feature/routing`.
Застосунок-лотерея з лабораторної 4 (гілка `main`) отримав Vue Router, дані з [DummyJSON](https://dummyjson.com), авторизацію за JWT і патерн Repository.

Демо: https://issaker-33.github.io/vue-lottery-app/routing/
Тестовий акаунт DummyJSON: `emilys` / `emilyspass`.

## Запуск

```bash
cp .env.example .env   # адреса API та час життя токена
npm install
npm run dev            # dev-сервер Vite
npm run build          # перевірка типів і продакшн-збірка в dist/
npm test               # Vitest
npm run lint:check     # oxlint + ESLint без змін файлів
npm run deploy:routing # збірка й публікація в gh-pages/routing/
```

Змінні середовища (`.env` не комітиться, див. `.env.example`):

| Змінна                   | Призначення                                         |
| ------------------------ | --------------------------------------------------- |
| `VITE_API_URL`           | базова адреса REST API, `https://dummyjson.com`     |
| `VITE_TOKEN_TTL_MINUTES` | час життя `accessToken` для `/auth/login` і refresh |

## Маршрути

| Шлях               | Сторінка                                    | meta                               |
| ------------------ | ------------------------------------------- | ---------------------------------- |
| `/`                | Home: опис проєкту, технології, GitHub      | `title`                            |
| `/about`           | About author: студент, Technical skills     | `title`                            |
| `/users`           | список учасників, `?page=2&q=john&sort=age` | `requiresAuth` (діє й на вкладені) |
| `/users/:id`       | профіль учасника, `id` через `props: true`  | `requiresAuth`                     |
| `/users/:id/edit`  | вкладений маршрут редагування               | `requiresAuth`                     |
| `/login`           | вхід, `AuthLayout`                          | `layout: 'auth'`, `guestOnly`      |
| `/:pathMatch(.*)*` | сторінка 404 з посиланням на головну        | `title`                            |

Усі сторінки завантажуються ліниво (`() => import(...)`). Використано hash-історію (`/#/users?page=2`), щоб глибокі посилання й оновлення сторінки працювали на GitHub Pages без серверних налаштувань.

## Завдання і де вони виконані

| Завдання                                                                       | Де реалізовано                                                   |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| vue-router, `AppHeader`, `AppNavigation`, `Logo` з активним пунктом меню       | `src/router/index.ts`, `src/components/layout/` (`AppLogo.vue`)  |
| Home, About author, сторінка 404, ліниве завантаження                          | `src/views/HomeView.vue`, `AboutView.vue`, `NotFoundView.vue`    |
| Інтерфейси `Readable`, `Searchable`, `Creatable`, `Editable`, `Deletable`      | `src/services/interfaces.ts`                                     |
| Тип `User`, `CreateUserDto`, `UpdateUserDto` за схемою DummyJSON               | `src/types/user.ts`                                              |
| `UserService`, `AuthService`, фабрика `ServiceProvider`                        | `src/services/`                                                  |
| HTTP-клієнт з адресою з `VITE_API_URL`, без URL у сервісах                     | `src/api/http-client.ts`, `src/config.ts`                        |
| Таблиця з DummyJSON Users, пагінація `limit`/`skip`, пошук у query-параметрах  | `src/views/UsersView.vue`, `src/composables/useUsersQuery.ts`    |
| `/users/:id` з `props: true` і вкладений `/users/:id/edit`                     | `UserDetailsView.vue`, `UserEditView.vue`                        |
| Форми з полями DummyJSON, VeeValidate + Zod                                    | `src/components/users/UserForm.vue`, `src/validation/schemas.ts` |
| Локальне оновлення стану після імітованих POST, PUT, DELETE                    | `src/stores/users.ts` (`applyLocalChanges`)                      |
| Логін `POST /auth/login`, токени в Pinia і `localStorage`, `/auth/me` з Bearer | `src/stores/auth.ts`, `src/views/LoginView.vue`                  |
| Login / Logout у меню, після Logout перехід на сторінку входу                  | `AppNavigation.vue`                                              |
| Navigation guard, `meta.requiresAuth`, `redirect` після входу                  | `src/router/guards.ts`, `router.beforeEach`                      |
| Стани loading / error, помилка авторизації у формі                             | `UsersView.vue`, `UserDetailsView.vue`, `LoginView.vue`          |
| Заголовок вкладки з `meta.title` через `router.afterEach`                      | `src/router/index.ts`                                            |
| Оновлення `accessToken` через `/auth/refresh` при 401 (interceptor)            | `src/api/http-client.ts`, `src/plugins/auth-interceptor.ts`      |
| Layouts через `meta.layout`                                                    | `src/App.vue`, `src/layouts/DefaultLayout.vue`, `AuthLayout.vue` |
| Деплой гілки на gh-pages                                                       | `npm run deploy:routing`                                         |

Компонент логотипа названо `AppLogo`, бо style guide Vue вимагає багатослівних назв компонентів.

## Патерн Repository

```
компонент / стор  ──>  ServiceProvider.users : UserRepository  ──>  http()  ──>  fetch(VITE_API_URL + path)
                                         (Readable & Searchable & Creatable & Editable & Deletable)
```

Компоненти й стори залежать лише від інтерфейсу `UserRepository`. У тестах `ServiceProvider.override()` підставляє `FakeUserService` і `FakeAuthService` (`src/services/__tests__/`), тому жоден тест не ходить у мережу.

DummyJSON лише імітує POST, PUT і DELETE. Стор `users` пам'ятає створених, змінених і видалених учасників (і зберігає ці зміни в `localStorage` через `watch` з `deep`) та накладає їх на кожну сторінку з API, тож список одразу актуальний.

## Структура

```
src/
  api/http-client.ts          fetch, базова адреса, помилки, interceptor 401 -> refresh
  config.ts                   змінні середовища
  services/                   інтерфейси, UserService, AuthService, ServiceProvider
  stores/                     auth (JWT-сесія), users (локальні зміни, переможці)
  router/                     маршрути, guard, заголовки вкладок
  layouts/                    DefaultLayout, AuthLayout
  plugins/auth-interceptor.ts зв'язок http-клієнта зі стором авторизації
  composables/useUsersQuery.ts сторінка, пошук і сортування в query-параметрах
  validation/schemas.ts       Zod-схеми форм
  views/                      Home, About, Users, UserDetails, UserEdit, Login, NotFound
  components/                 базові компоненти, layout/, users/
```

## Перевірки

GitHub Actions (`.github/workflows/ci.yml`) для `main` і `feature/**` запускає oxlint і ESLint, Prettier, `vue-tsc`, тести Vitest і збірку.
