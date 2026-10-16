<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ServiceProvider } from '@/services/service-provider'
import type { Page } from '@/services/interfaces'
import type { User } from '@/types/user'
import { useUsersStore } from '@/stores/users'
import { PAGE_SIZE, useUsersQuery } from '@/composables/useUsersQuery'
import WinnersList from '@/components/WinnersList.vue'
import UsersTable from '@/components/users/UsersTable.vue'
import BasePagination from '@/components/BasePagination.vue'

const store = useUsersStore()
const { page, search, sort, order, params, setPage, setSearch, toggleSort } = useUsersQuery()

const result = ref<Page<User> | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

// відповідь застарілого запиту (користувач уже перейшов на іншу сторінку) ігнорується
let lastRequest = 0

async function loadUsers(): Promise<void> {
  const request = ++lastRequest
  isLoading.value = true
  error.value = null
  try {
    const data = search.value
      ? await ServiceProvider.users.search(search.value, params.value)
      : await ServiceProvider.users.getAll(params.value)
    if (request === lastRequest) result.value = data
  } catch (e) {
    if (request === lastRequest) error.value = (e as Error).message
  } finally {
    if (request === lastRequest) isLoading.value = false
  }
}

// дані перезавантажуються щоразу, коли змінюються query-параметри
watch(params, loadUsers, { immediate: true })

const visiblePage = computed(() =>
  result.value ? store.applyLocalChanges(result.value, search.value) : null,
)
const users = computed(() => visiblePage.value?.items ?? [])
</script>

<template>
  <div class="users-page">
    <WinnersList
      :winners="store.winners"
      :can-pick-winner="store.canPickWinner(users)"
      @pick="store.pickWinner(users)"
      @remove="store.removeWinner"
    />

    <div class="card">
      <div class="card-body">
        <UsersTable
          :users="users"
          :start-index="(page - 1) * PAGE_SIZE"
          :search="search"
          :sort="sort"
          :order="order"
          @sort="toggleSort"
          @search="setSearch"
        />

        <div v-if="isLoading" class="state" role="status">
          <span class="spinner-border spinner-border-sm state__spinner"></span>
          Завантаження...
        </div>
        <div v-else-if="error" class="alert alert-danger state-alert" role="alert">
          Не вдалося завантажити учасників: {{ error }}
          <button
            type="button"
            class="btn btn-sm btn-outline-danger state-alert__retry"
            @click="loadUsers"
          >
            Спробувати ще
          </button>
        </div>
        <p v-else-if="users.length === 0" class="state">
          {{ search ? 'Нікого не знайдено' : 'Список учасників пустий' }}
        </p>

        <div v-if="visiblePage" class="users-page__footer">
          <span class="users-page__total">Усього: {{ visiblePage.total }}</span>
          <BasePagination
            :page="page"
            :total="visiblePage.total"
            :page-size="PAGE_SIZE"
            @change="setPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0;
  padding: 24px 0 8px;
  color: #6c757d;
}

.state__spinner {
  color: var(--bs-primary);
}

.state-alert__retry {
  margin-left: 8px;
}

.state-alert {
  margin: 16px 0 0;
}

.users-page__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
}

.users-page__total {
  color: #98a6ad;
}
</style>
