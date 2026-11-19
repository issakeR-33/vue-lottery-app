<script setup lang="ts">
import AppLogo from './AppLogo.vue'
import AppNavigation from './AppNavigation.vue'
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <AppLogo />
      <AppNavigation />
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  background-color: var(--p-content-background);
  border-bottom: 1px solid var(--p-content-border-color);

  &__inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px 24px;
    max-width: var(--app-max-width);
    margin: 0 auto;
    padding: 12px 16px;
  }
}
</style>
