import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { LocationQuery } from 'vue-router'
import { HttpError } from '@/api/http-client'
import { ServiceProvider } from '@/services/service-provider'
import type { Page } from '@/services/interfaces'
import { fullName, type CreateUserDto, type UpdateUserDto, type User } from '@/types/user'

export const MAX_WINNERS = 3
const STORAGE_KEY = 'vue-lottery-local-changes'

interface LocalChanges {
  created: User[]
  updated: Record<number, User>
  deletedIds: number[]
}

function emptyChanges(): LocalChanges {
  return { created: [], updated: {}, deletedIds: [] }
}

function loadChanges(): LocalChanges {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw
      ? { ...emptyChanges(), ...(JSON.parse(raw) as Partial<LocalChanges>) }
      : emptyChanges()
  } catch {
    return emptyChanges()
  }
}

function matchesQuery(user: User, query: string): boolean {
  const q = query.trim().toLowerCase()
  return !q || `${fullName(user)} ${user.username}`.toLowerCase().includes(q)
}

// DummyJSON лише імітує POST, PUT і DELETE: сервер відповідає успіхом, але дані не змінює.
// Тому після успішної відповіді стор сам пам'ятає створених, оновлених і видалених
// користувачів і накладає ці зміни на кожну сторінку, отриману з API.
export const useUsersStore = defineStore('users', () => {
  const saved = loadChanges()
  const created = ref<User[]>(saved.created)
  const updated = ref<Record<number, User>>(saved.updated)
  const deletedIds = ref<number[]>(saved.deletedIds)
  const winners = ref<User[]>([])
  // query списку (сторінка, пошук), щоб повернутися на той самий стан зі сторінки учасника
  const listQuery = ref<LocationQuery>({})
  const notice = ref<string | null>(null)
  let noticeTimer: ReturnType<typeof setTimeout> | undefined

  function notify(message: string): void {
    notice.value = message
    clearTimeout(noticeTimer)
    noticeTimer = setTimeout(() => {
      notice.value = null
    }, 4000)
  }

  // deep, щоб у localStorage потрапляли й зміни всередині масивів та об'єкта
  watch(
    [created, updated, deletedIds],
    () => {
      const changes: LocalChanges = {
        created: created.value,
        updated: updated.value,
        deletedIds: deletedIds.value,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(changes))
    },
    { deep: true },
  )

  function findCreated(id: number): User | undefined {
    return created.value.find((u) => u.id === id)
  }

  function applyLocalChanges(page: Page<User>, query = ''): Page<User> {
    const deleted = new Set(deletedIds.value)
    const items = page.items.filter((u) => !deleted.has(u.id)).map((u) => updated.value[u.id] ?? u)
    const removed = query ? page.items.length - items.length : deletedIds.value.length
    const extra = created.value.filter((u) => matchesQuery(u, query))
    // нові учасники показуються першими на першій сторінці
    return {
      ...page,
      items: page.skip === 0 ? [...extra, ...items] : items,
      total: Math.max(0, page.total + extra.length - removed),
    }
  }

  async function getUser(id: number): Promise<User> {
    const local = findCreated(id)
    if (local) return local
    if (deletedIds.value.includes(id)) {
      throw new HttpError(404, `Користувача з id ${id} видалено`)
    }
    return updated.value[id] ?? ServiceProvider.users.getById(id)
  }

  async function createUser(data: CreateUserDto): Promise<User> {
    const response = await ServiceProvider.users.create(data)
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
      const response = await ServiceProvider.users.update(id, data)
      user = { ...response, ...data, id }
      updated.value = { ...updated.value, [id]: user }
    }
    winners.value = winners.value.map((w) => (w.id === id ? user : w))
    return user
  }

  async function deleteUser(id: number): Promise<void> {
    if (findCreated(id)) {
      created.value = created.value.filter((u) => u.id !== id)
    } else {
      await ServiceProvider.users.delete(id)
      deletedIds.value.push(id)
    }
    removeWinner(id)
  }

  function canPickWinner(pool: readonly User[]): boolean {
    return (
      winners.value.length < MAX_WINNERS &&
      pool.some((u) => !winners.value.some((w) => w.id === u.id))
    )
  }

  // переможець обирається серед учасників поточної сторінки, які ще не перемагали
  function pickWinner(pool: readonly User[]): void {
    if (!canPickWinner(pool)) return
    const available = pool.filter((u) => !winners.value.some((w) => w.id === u.id))
    const chosen = available[Math.floor(Math.random() * available.length)]
    if (chosen) winners.value.push(chosen)
  }

  function removeWinner(id: number): void {
    winners.value = winners.value.filter((w) => w.id !== id)
  }

  function resetLocalChanges(): void {
    created.value = []
    updated.value = {}
    deletedIds.value = []
  }

  return {
    created,
    updated,
    deletedIds,
    winners,
    listQuery,
    notice,
    notify,
    applyLocalChanges,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    canPickWinner,
    pickWinner,
    removeWinner,
    resetLocalChanges,
  }
})
