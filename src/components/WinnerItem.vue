<script setup lang="ts">
import type { Participant } from '../types/Participant'

defineProps<{
  winner: Participant
}>()

defineEmits<{
  remove: [id: number]
}>()
</script>

<template>
  <span class="winner-chip">
    {{ winner.name }}
    <button type="button" class="winner-chip__remove" @click="$emit('remove', winner.id)">×</button>
  </span>
</template>

<style scoped>
.winner-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #0d6efd;
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.winner-chip__remove {
  background: none;
  border: none;
  color: #fff;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
}
</style>
