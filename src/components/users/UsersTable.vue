<script setup lang="ts">
import type { SortField, SortOrder } from '@/composables/useUsersQuery'
import { fullName, type User } from '@/types/user'
import SearchBar from '@/components/SearchBar.vue'

defineProps<{
  users: User[]
  startIndex: number
  search: string
  sort: SortField | null
  order: SortOrder
}>()

const emit = defineEmits<{
  sort: [field: SortField]
  search: [query: string]
}>()

const sortButtons: { field: SortField; label: string; icon: string }[] = [
  { field: 'name', label: "Ім'я", icon: 'bi-sort-alpha-down' },
  { field: 'age', label: 'Вік', icon: 'bi-sort-numeric-down' },
]
</script>

<template>
  <div class="table-toolbar">
    <div class="sort-controls">
      <button
        v-for="button in sortButtons"
        :key="button.field"
        type="button"
        class="table-btn"
        :class="{ 'table-btn--active': sort === button.field }"
        :aria-pressed="sort === button.field"
        @click="emit('sort', button.field)"
      >
        <i
          :class="[
            'bi',
            sort === button.field && order === 'desc' ? `${button.icon}-alt` : button.icon,
          ]"
        ></i>
        {{ button.label }}
      </button>
    </div>
    <SearchBar :initial="search" @filter-by-name="emit('search', $event)" />
  </div>

  <div class="table-wrapper">
    <table class="table participants-table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Age</th>
          <th scope="col">Email</th>
          <th scope="col">Phone number</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.id">
          <td class="index-cell">{{ startIndex + index + 1 }}</td>
          <td class="text-cell" :title="fullName(user)">{{ fullName(user) }}</td>
          <td>{{ user.age }}</td>
          <td class="text-cell" :title="user.email">{{ user.email }}</td>
          <td>{{ user.phone }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
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

.table-wrapper {
  overflow-x: auto;
}

.participants-table {
  width: 100%;
  margin-bottom: 0;
}

.participants-table th,
.participants-table td {
  padding: 12px 10px;
  vertical-align: middle;
  white-space: nowrap;
}

.participants-table th {
  color: #555;
  font-weight: 700;
}

.participants-table td {
  color: #777;
}

.text-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.index-cell {
  color: #98a6ad;
}

.table-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 38px;
  padding: 6px 14px;
  color: #495057;
  font-size: 0.875rem;
  white-space: nowrap;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
}

.table-btn:hover {
  background-color: #f1f3f5;
}

.table-btn--active {
  color: var(--bs-primary);
  background-color: var(--bs-primary-bg-subtle);
  border-color: var(--bs-primary);
}
</style>
