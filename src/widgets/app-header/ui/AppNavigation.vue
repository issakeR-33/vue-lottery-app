<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRoute, type RouteLocationRaw } from 'vue-router'
import { AppButton } from '@/shared/ui'
import { useSessionStore } from '@/entities/session'
import { LogoutButton } from '@/features/auth'
import { ThemeToggle } from '@/features/theme-toggle'

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
const { isAuthenticated, user } = storeToRefs(useSessionStore())

function inSection(item: NavItem): boolean {
  return Boolean(item.section && route.path.startsWith(item.section))
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
      <ThemeToggle />
      <template v-if="isAuthenticated">
        <span class="navigation__user" :title="user?.email">
          <i class="bi bi-person-circle"></i> {{ user?.firstName }}
        </span>
        <LogoutButton />
      </template>
      <AppButton v-else label="Login" size="small" :to="{ name: 'login' }" />
    </div>
  </nav>
</template>

<style scoped lang="scss">
.navigation {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;

  &__link {
    padding: 6px 12px;
    color: var(--p-text-muted-color);
    font-weight: 600;
    text-decoration: none;
    border-bottom: 2px solid transparent;

    &:hover,
    &--active {
      color: var(--p-primary-color);
    }

    &--active {
      border-bottom-color: var(--p-primary-color);
    }
  }

  &__auth {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: 12px;
  }

  &__user {
    color: var(--p-text-muted-color);
  }
}
</style>
