<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ServiceProvider } from '@/services/service-provider'
import type { Page } from '@/services/interfaces'
import { fullName, type User } from '@/types/user'
import type { UserFormValues } from '@/validation/schemas'
import { useUsersStore } from '@/stores/users'
import { PAGE_SIZE, useUsersQuery } from '@/composables/useUsersQuery'
import WinnersList from '@/components/WinnersList.vue'
import UsersTable from '@/components/users/UsersTable.vue'
import BasePagination from '@/components/BasePagination.vue'
import UserForm from '@/components/users/UserForm.vue'
import ConfirmDeleteModal from '@/components/users/ConfirmDeleteModal.vue'

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

// запам'ятовуємо стан списку, щоб сторінка учасника повертала саме сюди
const route = useRoute()
watch(
  () => route.query,
  (query) => {
    store.listQuery = query
  },
  { immediate: true },
)

const form = useTemplateRef('form')
const isCreating = ref(false)
const createError = ref<string | null>(null)

async function createUser(values: UserFormValues): Promise<void> {
  isCreating.value = true
  createError.value = null
  try {
    const user = await store.createUser(values)
    form.value?.reset()
    store.notify(`Учасника ${fullName(user)} додано`)
  } catch (e) {
    createError.value = (e as Error).message
  } finally {
    isCreating.value = false
  }
}

const deleting = ref<User | null>(null)
const isDeleteOpen = ref(false)
const isDeleting = ref(false)

function askDelete(user: User): void {
  deleting.value = user
  isDeleteOpen.value = true
}

async function deleteUser(user: User): Promise<void> {
  isDeleting.value = true
  try {
    await store.deleteUser(user.id)
    store.notify(`Учасника ${fullName(user)} видалено`)
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    isDeleting.value = false
    isDeleteOpen.value = false
  }
}
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
        <h5 class="card-title">REGISTER FORM</h5>
        <p class="hint">Please fill in all the fields.</p>
        <UserForm
          ref="form"
          mode="create"
          submit-label="Save"
          :submitting="isCreating"
          :server-error="createError"
          @submit="createUser"
        />
      </div>
    </div>

    <div v-if="store.notice" class="alert alert-success" role="status">{{ store.notice }}</div>

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
          @delete="askDelete"
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

    <ConfirmDeleteModal
      v-model:open="isDeleteOpen"
      :user="deleting"
      :deleting="isDeleting"
      @confirm="deleteUser"
    />
  </div>
</template>

<style scoped>
.card-title {
  margin-bottom: 2px;
  font-size: 1rem;
  font-weight: 700;
}

.hint {
  margin-bottom: 18px;
  color: #98a6ad;
  font-size: 1rem;
}

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
