<script setup lang="ts">
import { fullName, type User } from '@/types/user'

defineProps<{
  winner: User
}>()

defineEmits<{
  remove: [id: number]
}>()
</script>

<template>
  <span class="winner-chip">
    {{ fullName(winner) }}
    <button
      type="button"
      class="winner-chip__remove"
      @click="$emit('remove', winner.id)"
      aria-label="Прибрати переможця"
    >
      x
    </button>
  </span>
</template>

<style scoped>
.winner-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 2px 6px;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  background-color: var(--bs-primary);
  border-radius: 2px;
}

.winner-chip__remove {
  padding: 0 2px;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1;
  background: none;
  border: none;
  cursor: pointer;
}
</style>
