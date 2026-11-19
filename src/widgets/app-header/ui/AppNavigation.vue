<script setup lang="ts">
import { useRoute, useRouter, type RouteLocationRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

interface NavItem {
  label: string
  to: RouteLocationRaw
  // префікс шляху, за яким пункт підсвічується й на вкладених сторінках (/users/5)
  section?: string
}

const items: NavItem[] = [
  { label: 'Home', to: { name: 'home' } },
  { label: 'About author', to: { name: 'about' } },
  { label: 'Users', to: { name: 'users' }, section: '/users' },
]

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

function inSection(item: NavItem): boolean {
  return Boolean(item.section && route.path.startsWith(item.section))
}

function logout(): void {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <nav class="navigation" aria-label="Розділи застосунку">
    <RouterLink
      v-for="item in items"
      :key="item.label"
      v-slot="{ href, navigate, isExactActive }"
      :to="item.to"
      custom
    >
      <a
        :href="href"
        class="navigation__link"
        :class="{ 'navigation__link--active': isExactActive || inSection(item) }"
        :aria-current="isExactActive || inSection(item) ? 'page' : undefined"
        @click="navigate"
      >
        {{ item.label }}
      </a>
    </RouterLink>

    <div class="navigation__auth">
      <template v-if="auth.isAuthenticated">
        <span class="navigation__user" :title="auth.user?.email">
          <i class="bi bi-person-circle"></i> {{ auth.user?.firstName }}
        </span>
        <button type="button" class="btn btn-outline-primary btn-sm" @click="logout">Logout</button>
      </template>
      <RouterLink v-else :to="{ name: 'login' }" class="btn btn-primary btn-sm">Login</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.navigation {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}

.navigation__link {
  padding: 6px 12px;
  color: #555;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 2px solid transparent;
}

.navigation__link:hover {
  color: var(--bs-primary);
}

.navigation__link--active {
  color: var(--bs-primary);
  border-bottom-color: var(--bs-primary);
}

.navigation__auth {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 12px;
}

.navigation__user {
  color: #777;
}
</style>
