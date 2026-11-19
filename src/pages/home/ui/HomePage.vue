<script setup lang="ts">
import { AppButton, AppCard } from '@/shared/ui'

const REPOSITORY_URL = 'https://github.com/issakeR-33/vue-lottery-app'

const technologies = [
  { name: 'Vue 3', note: 'Composition API, <script setup>' },
  { name: 'TypeScript', note: 'строга типізація моделей і сервісів' },
  { name: 'Vue Router', note: 'ліниві сторінки, вкладені маршрути, guards' },
  { name: 'Pinia', note: 'стори session, users, winners і налаштувань' },
  { name: 'VeeValidate + Zod', note: 'валідація форм' },
  { name: 'PrimeVue 4', note: 'обгортки в shared/ui, тема Aura з кольором застосунку' },
  { name: 'Vite, Vitest, ESLint', note: 'збірка, тести, якість коду' },
]
</script>

<template>
  <AppCard>
    <h1 class="page-title">Vue Lottery</h1>
    <p class="lead-text">
      Застосунок для розіграшу: список учасників береться з DummyJSON API, з нього випадково
      обираються до трьох переможців. Учасників можна шукати, гортати сторінками, переглядати,
      додавати, редагувати й видаляти. Розділ Users доступний після входу з JWT.
    </p>

    <h2 class="section-title">Технології</h2>
    <ul class="tech-list">
      <li v-for="tech in technologies" :key="tech.name">
        <strong>{{ tech.name }}</strong>
        <span class="tech-list__note">{{ tech.note }}</span>
      </li>
    </ul>

    <AppButton label="Проєкт на GitHub" icon="bi bi-github" :href="REPOSITORY_URL" />
  </AppCard>
</template>

<style scoped>
.page-title {
  margin-bottom: 8px;
  font-size: 1.5rem;
  font-weight: 700;
}

.lead-text {
  color: var(--p-text-muted-color);
}

.section-title {
  margin: 24px 0 10px;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
}

.tech-list {
  display: grid;
  gap: 6px;
  margin-bottom: 24px;
  padding: 0;
  list-style: none;
}

.tech-list__note {
  margin-left: 8px;
  color: var(--p-text-muted-color);
}
</style>
