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
  <div class="card">
    <div class="card-body winners-body">
      <!-- поле переможців у вигляді поля вводу з тегами, як на дизайні -->
      <div class="winners-list">
        <WinnerItem
          v-for="winner in winners"
          :key="winner.id"
          :winner="winner"
          @remove="emit('remove', $event)"
        />
        <span class="winners-placeholder">Winners</span>
      </div>
      <BaseButton :disabled="!canPickWinner" @click="emit('pick')">New winner</BaseButton>
    </div>
  </div>
</template>

<style scoped>
.winners-body {
  display: flex;
  align-items: center;
  gap: 22px;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.winners-list {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
  min-height: 38px;
  padding: 4px 7px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.winners-placeholder {
  padding: 0 4px;
  color: #999;
}
</style>
