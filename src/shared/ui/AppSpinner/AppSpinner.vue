<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner'

defineProps<{
  label?: string
}>()
</script>

<template>
  <div class="app-spinner" role="status">
    <ProgressSpinner class="app-spinner__icon" stroke-width="6" aria-hidden="true" />
    <span>{{ label ?? 'Завантаження...' }}</span>
  </div>
</template>

<style scoped lang="scss">
.app-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px 0 8px;
  color: var(--p-text-muted-color);

  &__icon {
    width: 22px;
    height: 22px;
    margin: 0;
  }
}
</style>
