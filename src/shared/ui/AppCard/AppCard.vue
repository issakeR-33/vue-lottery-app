<script setup lang="ts">
import Card from 'primevue/card'
</script>

<template>
  <Card class="app-card">
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <template #content>
      <slot />
    </template>
  </Card>
</template>

<style scoped lang="scss">
.app-card {
  margin-bottom: 18px;
}
</style>
