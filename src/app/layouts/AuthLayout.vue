<script setup lang="ts">
import AppLogo from '@/widgets/app-header/ui/AppLogo.vue'
</script>

<template>
  <main class="auth-layout">
    <div class="auth-layout__logo">
      <AppLogo />
    </div>
    <slot />
    <RouterLink :to="{ name: 'home' }" class="auth-layout__back">
      <i class="bi bi-arrow-left"></i> На головну
    </RouterLink>
  </main>
</template>

<style scoped lang="scss">
.auth-layout {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  max-width: 400px;
  margin: 0 auto;
  padding: 80px 16px 48px;

  &__logo {
    margin-bottom: 20px;
    text-align: center;
  }

  &__back {
    align-self: center;
    color: var(--p-text-muted-color);
    text-decoration: none;

    &:hover {
      color: var(--p-primary-color);
    }
  }
}
</style>
