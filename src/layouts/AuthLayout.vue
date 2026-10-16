<script setup lang="ts">
import AppLogo from '@/components/layout/AppLogo.vue'
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

<style scoped>
.auth-layout {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  max-width: 400px;
  margin: 0 auto;
  padding: 80px 16px 48px;
}

.auth-layout__logo {
  margin-bottom: 20px;
  text-align: center;
}

.auth-layout__back {
  align-self: center;
  color: #98a6ad;
  text-decoration: none;
}

.auth-layout__back:hover {
  color: var(--bs-primary);
}
</style>
