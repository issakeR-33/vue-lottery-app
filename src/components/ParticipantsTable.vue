<script setup lang="ts">
import type { Participant } from '../types/Participant'

defineProps<{
  participants: Participant[]
}>()
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
            </tr>
          </thead>
          <tbody>
            <tr v-for="(participant, index) in participants" :key="participant.id">
              <td class="index-cell">{{ index + 1 }}</td>
              <td class="text-cell" :title="participant.name">{{ participant.name }}</td>
              <td>{{ participant.dob }}</td>
              <td class="text-cell" :title="participant.email">{{ participant.email }}</td>
              <td>{{ participant.phone }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="participants.length === 0" class="empty-message">Список учасників пустий</p>
    </div>
  </div>
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

.empty-message {
  color: #6c757d;
  text-align: center;
  margin: 0;
  padding: 24px 0 8px;
}
</style>
