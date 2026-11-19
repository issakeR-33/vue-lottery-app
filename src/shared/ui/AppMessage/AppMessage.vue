<script setup lang="ts">
import Message from 'primevue/message'

withDefaults(
  defineProps<{
    severity?: 'success' | 'error' | 'info'
  }>(),
  { severity: 'error' },
)
</script>

<template>
  <Message :severity="severity" class="app-message" role="alert">
    <slot />
  </Message>
</template>

<style scoped lang="scss">
.app-message {
  margin-bottom: 16px;
}
</style>
