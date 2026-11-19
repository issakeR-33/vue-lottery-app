import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { LocationQuery } from 'vue-router'
import { HttpError, ServiceProvider, type Page, type PageParams } from '@/shared/api'
import { USER_SERVICE, type UserRepository } from '../api/user.service'
import { fullName, type CreateUserDto, type UpdateUserDto, type User } from './types'

function matchesQuery(user: User, query: string): boolean {
  const q = query.trim().toLowerCase()
  return !q || `${fullName(user)} ${user.username}`.toLowerCase().includes(q)
}

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

const service = () => ServiceProvider.get<UserRepository>(USER_SERVICE)

// DummyJSON лише імітує POST, PUT і DELETE: сервер відповідає успіхом, але дані не змінює.
// Тому стор сам пам'ятає створених, оновлених і видалених користувачів і накладає
// ці зміни на кожну сторінку, отриману з API. Локальні зміни зберігає в localStorage
// плагін pinia-plugin-persistedstate (опція persist нижче).
export const useUsersStore = defineStore(
  'users',
  () => {
    // остання сторінка з API та пошуковий запит, з яким її отримано
    const page = ref<Page<User> | null>(null)
    const query = ref('')
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const current = ref<User | null>(null)
    const isCurrentLoading = ref(false)
    const currentError = ref<string | null>(null)

    const created = ref<User[]>([])
    const updated = ref<Record<number, User>>({})
    const deletedIds = ref<number[]>([])

    // query списку (сторінка, пошук), щоб повернутися на той самий стан зі сторінки учасника
    const listQuery = ref<LocationQuery>({})

    const visiblePage = computed(() =>
      page.value ? applyLocalChanges(page.value, query.value) : null,
    )
    const users = computed(() => visiblePage.value?.items ?? [])
    const total = computed(() => visiblePage.value?.total ?? 0)
    const hasUsers = computed(() => users.value.length > 0)

    function findCreated(id: number): User | undefined {
      return created.value.find((u) => u.id === id)
    }

    function applyLocalChanges(source: Page<User>, search = ''): Page<User> {
      const deleted = new Set(deletedIds.value)
      const items = source.items
        .filter((u) => !deleted.has(u.id))
        .map((u) => updated.value[u.id] ?? u)
      const removed = search ? source.items.length - items.length : deletedIds.value.length
      const extra = created.value.filter((u) => matchesQuery(u, search))
      // нові учасники показуються першими на першій сторінці
      return {
        ...source,
        items: source.skip === 0 ? [...extra, ...items] : items,
        total: Math.max(0, source.total + extra.length - removed),
      }
    }

    // відповідь застарілого запиту (користувач уже перейшов на іншу сторінку) ігнорується
    let lastRequest = 0

    async function fetchUsers(params: PageParams = {}, search = ''): Promise<void> {
      const request = ++lastRequest
      isLoading.value = true
      error.value = null
      try {
        const result = search
          ? await service().search(search, params)
          : await service().getAll(params)
        if (request !== lastRequest) return
        page.value = result
        query.value = search
      } catch (e) {
        if (request === lastRequest) error.value = errorMessage(e)
      } finally {
        if (request === lastRequest) isLoading.value = false
      }
    }

    async function getUser(id: number): Promise<User> {
      const local = findCreated(id)
      if (local) return local
      if (deletedIds.value.includes(id)) {
        throw new HttpError(404, `Користувача з id ${id} видалено`)
      }
      return updated.value[id] ?? service().getById(id)
    }

    async function fetchUser(id: number): Promise<void> {
      isCurrentLoading.value = true
      currentError.value = null
      try {
        current.value = await getUser(id)
      } catch (e) {
        current.value = null
        currentError.value = errorMessage(e)
      } finally {
        isCurrentLoading.value = false
      }
    }

    async function createUser(data: CreateUserDto): Promise<User> {
      const response = await service().create(data)
      // сервер щоразу повертає той самий id (total + 1), тож робимо його унікальним локально
      const id = Math.max(response.id, ...created.value.map((u) => u.id + 1))
      const user: User = { ...response, ...data, id }
      created.value.unshift(user)
      return user
    }

    async function updateUser(id: number, data: UpdateUserDto): Promise<User> {
      const local = findCreated(id)
      let user: User
      if (local) {
        // такого користувача немає на сервері, PUT повернув би 404
        user = { ...local, ...data }
        created.value = created.value.map((u) => (u.id === id ? user : u))
      } else {
        const response = await service().update(id, data)
        user = { ...response, ...data, id }
        updated.value = { ...updated.value, [id]: user }
      }
      if (current.value?.id === id) current.value = user
      return user
    }

    async function removeUser(id: number): Promise<void> {
      if (findCreated(id)) {
        created.value = created.value.filter((u) => u.id !== id)
      } else {
        await service().delete(id)
        deletedIds.value.push(id)
      }
      if (current.value?.id === id) current.value = null
    }

    function resetLocalChanges(): void {
      created.value = []
      updated.value = {}
      deletedIds.value = []
    }

    return {
      users,
      total,
      isLoading,
      error,
      hasUsers,
      current,
      isCurrentLoading,
      currentError,
      created,
      updated,
      deletedIds,
      listQuery,
      applyLocalChanges,
      fetchUsers,
      getUser,
      fetchUser,
      createUser,
      updateUser,
      removeUser,
      resetLocalChanges,
    }
  },
  {
    persist: {
      key: 'vue-lottery-local-changes',
      pick: ['created', 'updated', 'deletedIds'],
    },
  },
)
