<script setup lang="ts">
import { ref } from 'vue'
import type { Participant } from '../types/Participant'
import EditParticipantModal from './EditParticipantModal.vue'

defineProps<{
  participants: Participant[]
}>()

const emit = defineEmits<{
  update: [participant: Participant]
}>()

const isEditModalOpen = ref(false)
const editingParticipant = ref<Participant | null>(null)

function openEditModal(participant: Participant): void {
  editingParticipant.value = participant
  isEditModalOpen.value = true
}
</script>

<template>
  <div class="card">
    <div class="card-body">
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
            <tr v-for="(participant, index) in participants" :key="participant.id">
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
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="participants.length === 0" class="empty-message">Список учасників пустий</p>
    </div>
  </div>

  <EditParticipantModal
    v-model:open="isEditModalOpen"
    :participant="editingParticipant"
    :participants="participants"
    @update="emit('update', $event)"
  />
</template>

<style scoped>
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
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.participants-table th {
  font-weight: 600;
}

.index-cell {
  color: #6c757d;
}

.actions-cell {
  text-align: right;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
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

.table-btn--edit:hover {
  border-color: #0d6efd;
  background-color: #e7f1ff;
  color: #0d6efd;
}

.empty-message {
  color: #6c757d;
  text-align: center;
  margin: 0;
  padding: 24px 0 8px;
}
</style>
