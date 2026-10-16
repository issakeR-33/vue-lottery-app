<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Participant } from '../types/Participant'
import {
  filterByName,
  sortParticipants,
  type SortDirection,
  type SortKey,
} from '../utils/participants'
import SearchBar from './SearchBar.vue'
import EditParticipantModal from './EditParticipantModal.vue'
import DeleteParticipantModal from './DeleteParticipantModal.vue'

const props = defineProps<{
  participants: Participant[]
}>()

const emit = defineEmits<{
  update: [participant: Participant]
  delete: [id: number]
}>()

const searchQuery = ref('')
const sortKey = ref<SortKey | null>(null)
const sortDirection = ref<SortDirection>('asc')

function toggleSort(key: SortKey): void {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

function sortIcon(key: SortKey, base: string): string {
  const isDesc = sortKey.value === key && sortDirection.value === 'desc'
  return `bi ${base}${isDesc ? '-alt' : ''}`
}

// спочатку фільтрація, потім сортування; props.participants не змінюється
const displayedParticipants = computed(() =>
  sortParticipants(
    filterByName(props.participants, searchQuery.value),
    sortKey.value,
    sortDirection.value,
  ),
)

const isEditModalOpen = ref(false)
const editingParticipant = ref<Participant | null>(null)

function openEditModal(participant: Participant): void {
  editingParticipant.value = participant
  isEditModalOpen.value = true
}

const isDeleteModalOpen = ref(false)
const deletingParticipant = ref<Participant | null>(null)

function openDeleteModal(participant: Participant): void {
  deletingParticipant.value = participant
  isDeleteModalOpen.value = true
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="table-toolbar">
        <div class="sort-controls">
          <button
            type="button"
            class="table-btn"
            :class="{ 'table-btn--active': sortKey === 'name' }"
            @click="toggleSort('name')"
          >
            <i :class="sortIcon('name', 'bi-sort-alpha-down')"></i>
            Ім'я
          </button>
          <button
            type="button"
            class="table-btn"
            :class="{ 'table-btn--active': sortKey === 'dob' }"
            @click="toggleSort('dob')"
          >
            <i :class="sortIcon('dob', 'bi-sort-down')"></i>
            Дата народження
          </button>
        </div>
        <SearchBar @filter-by-name="searchQuery = $event" />
      </div>

      <div class="table-wrapper">
        <table class="table participants-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Date of Birth</th>
              <th scope="col">Email</th>
              <th scope="col">Phone number</th>
              <th scope="col" class="actions-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(participant, index) in displayedParticipants" :key="participant.id">
              <td class="index-cell">{{ index + 1 }}</td>
              <td class="text-cell" :title="participant.name">{{ participant.name }}</td>
              <td>{{ participant.dob }}</td>
              <td class="text-cell" :title="participant.email">{{ participant.email }}</td>
              <td>{{ participant.phone }}</td>
              <td class="actions-cell">
                <div class="actions">
                  <button
                    type="button"
                    class="table-btn table-btn--edit"
                    @click="openEditModal(participant)"
                  >
                    <i class="bi bi-pencil"></i>
                    Редагувати дані
                  </button>
                  <button
                    type="button"
                    class="table-btn table-btn--delete"
                    @click="openDeleteModal(participant)"
                  >
                    <i class="bi bi-trash"></i>
                    Видалити учасника
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="displayedParticipants.length === 0" class="empty-message">
        {{ participants.length === 0 ? 'Список учасників пустий' : 'Нікого не знайдено' }}
      </p>
    </div>
  </div>

  <EditParticipantModal
    v-model:open="isEditModalOpen"
    :participant="editingParticipant"
    :participants="participants"
    @update="emit('update', $event)"
  />

  <DeleteParticipantModal
    v-model:open="isDeleteModalOpen"
    :participant="deletingParticipant"
    @confirm="emit('delete', $event)"
  />
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

.text-cell {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.participants-table th {
  color: #555;
  font-weight: 700;
}

.participants-table td {
  color: #777;
}

.index-cell {
  color: #98a6ad;
}

.actions-cell {
  text-align: right;
}

/* у вузькому макеті з дизайну кнопки стоять одна під одною */
.actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
}

.table-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background-color: #fff;
  color: #495057;
  font-size: 0.8125rem;
  line-height: 1.5;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.table-btn:hover {
  background-color: #f1f3f5;
}

.sort-controls .table-btn {
  min-height: 38px;
  padding: 6px 14px;
  font-size: 0.875rem;
}

.table-btn--active {
  border-color: var(--bs-primary);
  background-color: var(--bs-primary-bg-subtle);
  color: var(--bs-primary);
}

.table-btn--active:hover {
  background-color: var(--bs-primary-border-subtle);
}

.table-btn--edit:hover {
  border-color: var(--bs-primary);
  background-color: var(--bs-primary-bg-subtle);
  color: var(--bs-primary);
}

.table-btn--delete {
  color: #dc3545;
}

.table-btn--delete:hover {
  border-color: #dc3545;
  background-color: #fdecee;
}

.empty-message {
  color: #6c757d;
  text-align: center;
  margin: 0;
  padding: 24px 0 8px;
}
</style>
