<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { AppCard } from '@/shared/ui'
import { LoginForm } from '@/features/auth'
import { safeRedirect } from '@/shared/lib'

const route = useRoute()
const router = useRouter()

// після входу повертаємося на сторінку, з якої guard перенаправив на логін
function onLoggedIn(): Promise<unknown> {
  return router.replace(safeRedirect(route.query.redirect) ?? { name: 'users' })
}
</script>

<template>
  <AppCard>
    <h1 class="login-title">LOGIN</h1>
    <p class="hint">Увійдіть, щоб побачити список учасників.</p>
    <LoginForm @success="onLoggedIn" />
    <p class="demo-account">
      Тестовий акаунт DummyJSON: <code>emilys</code> / <code>emilyspass</code>
    </p>
  </AppCard>
</template>

<style scoped lang="scss">
.login-title {
  margin-bottom: 2px;
  font-size: 1rem;
  font-weight: 700;
}

.hint {
  margin-bottom: 18px;
  color: var(--p-text-muted-color);
}

.demo-account {
  margin: 16px 0 0;
  color: var(--p-text-muted-color);
  font-size: 0.85rem;
  text-align: center;
}
</style>
