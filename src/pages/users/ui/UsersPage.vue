<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { AppButton, AppCard, AppMessage, AppPaginator, useNotify } from '@/shared/ui'
import { fullName, useUsersStore } from '@/entities/user'
import { WinnersList } from '@/features/lottery'
import { UserForm, type UserFormValues } from '@/features/user-form'
import { PAGE_SIZE, UsersTable, useUsersQuery } from '@/widgets/users-table'

// сторінка не звертається до сервісів: дані й дії беруться зі стору users
const store = useUsersStore()
const { users, total, isLoading, error, listQuery } = storeToRefs(store)
const { fetchUsers, createUser } = store

const notify = useNotify()
const { page, search, sort, order, params, setPage, setSearch, toggleSort } = useUsersQuery()

function load(): Promise<void> {
  return fetchUsers(params.value, search.value)
}

// дані перезавантажуються щоразу, коли змінюються query-параметри
watch([params, search], load, { immediate: true })

// запам'ятовуємо стан списку, щоб сторінка учасника повертала саме сюди
const route = useRoute()
watch(
  () => route.query,
  (query) => {
    listQuery.value = query
  },
  { immediate: true },
)

const form = useTemplateRef('form')
const isCreating = ref(false)
const createError = ref<string | null>(null)

async function onCreate(values: UserFormValues): Promise<void> {
  isCreating.value = true
  createError.value = null
  try {
    const user = await createUser(values)
    form.value?.reset()
    notify.success('Учасника додано', fullName(user))
  } catch (e) {
    createError.value = (e as Error).message
    notify.error('Не вдалося додати учасника', createError.value)
  } finally {
    isCreating.value = false
  }
}
</script>

<template>
  <div class="users-page">
    <WinnersList :pool="users" />

    <AppCard>
      <h5 class="card-title">REGISTER FORM</h5>
      <p class="hint">Please fill in all the fields.</p>
      <UserForm
        ref="form"
        mode="create"
        submit-label="Save"
        :submitting="isCreating"
        :server-error="createError"
        @submit="onCreate"
      />
    </AppCard>

    <AppCard>
      <AppMessage v-if="error">
        Не вдалося завантажити учасників: {{ error }}
        <AppButton
          label="Спробувати ще"
          size="small"
          severity="danger"
          variant="outlined"
          class="retry"
          @click="load"
        />
      </AppMessage>
      <UsersTable
        :users="users"
        :start-index="(page - 1) * PAGE_SIZE"
        :search="search"
        :sort="sort"
        :order="order"
        :loading="isLoading"
        @sort="toggleSort"
        @search="setSearch"
      />
      <div class="users-page__footer">
        <span class="text-muted">Усього: {{ total }}</span>
        <AppPaginator :page="page" :total="total" :page-size="PAGE_SIZE" @change="setPage" />
      </div>
    </AppCard>
  </div>
</template>

<style scoped lang="scss">
.card-title {
  margin-bottom: 2px;
  font-size: 1rem;
  font-weight: 700;
}

.hint {
  margin-bottom: 18px;
  color: var(--p-text-muted-color);
}

.retry {
  margin-left: 8px;
}

.users-page__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
}
</style>
