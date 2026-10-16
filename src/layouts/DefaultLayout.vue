<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <main class="app">
    <slot />
  </main>
</template>
