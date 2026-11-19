<script setup lang="ts">
import { ref } from 'vue'
import { AppButton, AppConfirmDialog, AppSearchBar, AppTable, useNotify } from '@/shared/ui'
import { fullName, useUsersStore, type User } from '@/entities/user'
import { useWinnersStore } from '@/features/lottery'
import type { SortField, SortOrder } from '../model/useUsersQuery'

defineProps<{
  users: User[]
  startIndex: number
  search: string
  sort: SortField | null
  order: SortOrder
  loading?: boolean
}>()

const emit = defineEmits<{
  sort: [field: SortField]
  search: [query: string]
}>()

const columns = [
  { field: 'index', header: '#', class: 'index-cell' },
  { field: 'name', header: 'Name', class: 'text-cell' },
  { field: 'age', header: 'Age' },
  { field: 'email', header: 'Email', class: 'text-cell' },
  { field: 'phone', header: 'Phone number' },
  { field: 'actions', header: 'Actions', class: 'actions-cell' },
]

const sortButtons: { field: SortField; label: string; icon: string }[] = [
  { field: 'name', label: "Ім'я", icon: 'bi-sort-alpha-down' },
  { field: 'age', label: 'Вік', icon: 'bi-sort-numeric-down' },
]

const usersStore = useUsersStore()
const winnersStore = useWinnersStore()
const notify = useNotify()

const deleting = ref<User | null>(null)
const isDeleteOpen = ref(false)
const isDeleting = ref(false)

function askDelete(user: User): void {
  deleting.value = user
  isDeleteOpen.value = true
}

async function confirmDelete(): Promise<void> {
  const user = deleting.value
  if (!user) return
  isDeleting.value = true
  try {
    await usersStore.removeUser(user.id)
    // видалений учасник зникає і з переможців
    winnersStore.remove(user.id)
    notify.success('Учасника видалено', fullName(user))
  } catch (e) {
    notify.error('Не вдалося видалити учасника', (e as Error).message)
  } finally {
    isDeleting.value = false
    isDeleteOpen.value = false
  }
}
</script>

<template>
  <div class="table-toolbar">
    <div class="sort-controls">
      <AppButton
        v-for="button in sortButtons"
        :key="button.field"
        :label="button.label"
        :icon="`bi ${sort === button.field && order === 'desc' ? `${button.icon}-alt` : button.icon}`"
        :variant="sort === button.field ? undefined : 'outlined'"
        severity="secondary"
        size="small"
        :aria-pressed="sort === button.field"
        @click="emit('sort', button.field)"
      />
    </div>
    <AppSearchBar :initial="search" @filter-by-name="emit('search', $event)" />
  </div>

  <AppTable :rows="users" :columns="columns" :loading="loading">
    <template #cell-index="{ index }">{{ startIndex + index + 1 }}</template>
    <template #cell-name="{ row }">
      <RouterLink
        :to="{ name: 'user', params: { id: row.id } }"
        class="name-link"
        :title="fullName(row)"
      >
        {{ fullName(row) }}
      </RouterLink>
    </template>
    <template #cell-actions="{ row }">
      <div class="actions">
        <AppButton
          label="Редагувати дані"
          icon="bi bi-pencil"
          size="small"
          variant="outlined"
          :to="{ name: 'user-edit', params: { id: row.id } }"
        />
        <AppButton
          label="Видалити учасника"
          icon="bi bi-trash"
          size="small"
          variant="outlined"
          severity="danger"
          @click="askDelete(row)"
        />
      </div>
    </template>
    <template #empty>
      <span class="text-muted">{{
        search ? 'Нікого не знайдено' : 'Список учасників пустий'
      }}</span>
    </template>
  </AppTable>

  <AppConfirmDialog
    v-model:visible="isDeleteOpen"
    header="Видалення учасника"
    :loading="isDeleting"
    @confirm="confirmDelete"
  >
    <template v-if="deleting">
      Ви дійсно бажаєте видалити учасника "{{ fullName(deleting) }}", "{{ deleting.email }}"?
    </template>
  </AppConfirmDialog>
</template>

<style scoped lang="scss">
.table-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.sort-controls {
  display: flex;
  gap: 8px;
}

.name-link {
  color: inherit;
  text-decoration: none;

  &:hover {
    color: var(--p-primary-color);
    text-decoration: underline;
  }
}

/* у вузькому макеті з дизайну кнопки стоять одна під одною */
.actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
}

:deep(.text-cell) {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.index-cell) {
  color: var(--p-text-muted-color);
}

:deep(.actions-cell) {
  width: 1%;
}
</style>
