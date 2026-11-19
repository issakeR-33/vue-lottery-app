<script setup lang="ts">
import { fullName, type User } from '@/entities/user'

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
      aria-label="Прибрати переможця"
      @click="$emit('remove', winner.id)"
    >
      x
    </button>
  </span>
</template>

<style scoped lang="scss">
.winner-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 2px 6px;
  color: var(--p-primary-contrast-color);
  font-size: 0.75rem;
  font-weight: 700;
  background-color: var(--p-primary-color);
  border-radius: 2px;

  &__remove {
    padding: 0 2px;
    color: inherit;
    font-size: 0.8rem;
    font-weight: 700;
    line-height: 1;
    background: none;
    border: none;
    cursor: pointer;
  }
}
</style>
