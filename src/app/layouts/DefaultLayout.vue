<script setup lang="ts">
import { AppHeader } from '@/widgets/app-header'
</script>

<template>
  <AppHeader />
  <main class="app">
    <slot />
  </main>
</template>
