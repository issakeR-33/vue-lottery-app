import { computed } from 'vue'
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router'
import type { PageParams } from '@/services/interfaces'

export const PAGE_SIZE = 10

export type SortField = 'name' | 'age'
export type SortOrder = 'asc' | 'desc'

const SORT_BY: Record<SortField, string> = {
  name: 'firstName',
  age: 'age',
}

function single(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

// Сторінка, пошук і сортування живуть у query-параметрах URL (/users?page=2&q=john),
// тому стан списку можна скопіювати посиланням, а кнопка "назад" його відновлює.
export function useUsersQuery() {
  const route = useRoute()
  const router = useRouter()

  const page = computed(() => {
    const value = Number(route.query.page)
    return Number.isInteger(value) && value > 0 ? value : 1
  })

  const search = computed(() => single(route.query.q).trim())

  const sort = computed<SortField | null>(() => {
    const value = single(route.query.sort)
    return value === 'name' || value === 'age' ? value : null
  })

  const order = computed<SortOrder>(() => (single(route.query.order) === 'desc' ? 'desc' : 'asc'))

  const params = computed<PageParams>(() => ({
    limit: PAGE_SIZE,
    skip: (page.value - 1) * PAGE_SIZE,
    sortBy: sort.value ? SORT_BY[sort.value] : undefined,
    order: sort.value ? order.value : undefined,
  }))

  function update(patch: Record<string, string | number | undefined>, replace = false) {
    const query: LocationQueryRaw = { ...route.query, ...patch }
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === '' || (key === 'page' && value === 1)) {
        delete query[key]
      }
    }
    return replace ? router.replace({ query }) : router.push({ query })
  }

  function setPage(value: number) {
    return update({ page: value })
  }

  // новий пошук починається з першої сторінки; replace, щоб не засмічувати історію кожною літерою
  function setSearch(value: string) {
    if (value === search.value) return
    return update({ q: value, page: undefined }, true)
  }

  // повторний клік по тому самому полю змінює напрямок
  function toggleSort(field: SortField) {
    const nextOrder: SortOrder = sort.value === field && order.value === 'asc' ? 'desc' : 'asc'
    return update({ sort: field, order: nextOrder, page: undefined })
  }

  return { page, search, sort, order, params, setPage, setSearch, toggleSort }
}
