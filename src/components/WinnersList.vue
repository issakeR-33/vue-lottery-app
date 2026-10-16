<script setup lang="ts">
import type { Participant } from '../types/Participant'
import WinnerItem from './WinnerItem.vue'
import BaseButton from './BaseButton.vue'

defineProps<{
  winners: Participant[]
  canPickWinner: boolean
}>()

const emit = defineEmits<{
  pick: []
  remove: [id: number]
}>()
</script>

<template>
  <div class="card winners-card">
    <div class="card-body winners-body">
      <div class="winners-list">
        <span v-if="winners.length === 0" class="winners-placeholder">Winners</span>
        <WinnerItem
          v-for="winner in winners"
          :key="winner.id"
          :winner="winner"
          @remove="emit('remove', $event)"
        />
      </div>
      <BaseButton :disabled="!canPickWinner" @click="emit('pick')">New winner</BaseButton>
    </div>
  </div>
</template>

<style scoped>
.winners-card {
  margin-bottom: 32px;
}

.winners-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.winners-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}

.winners-placeholder {
  color: #adb5bd;
}
</style>
