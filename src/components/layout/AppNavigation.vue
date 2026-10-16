<script setup lang="ts">
import { useRoute, type RouteLocationRaw } from 'vue-router'

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
  </nav>
</template>

<style scoped>
.navigation {
  display: flex;
  flex-wrap: wrap;
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
</style>
