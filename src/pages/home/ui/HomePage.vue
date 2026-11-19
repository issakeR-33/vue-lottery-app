<script setup lang="ts">
const REPOSITORY_URL = 'https://github.com/issakeR-33/vue-lottery-app'

const technologies = [
  { name: 'Vue 3', note: 'Composition API, <script setup>' },
  { name: 'TypeScript', note: 'строга типізація моделей і сервісів' },
  { name: 'Vue Router', note: 'ліниві сторінки, вкладені маршрути, guards' },
  { name: 'Pinia', note: 'стан авторизації та локальні зміни списку' },
  { name: 'VeeValidate + Zod', note: 'валідація форм' },
  { name: 'Bootstrap 5 (SCSS)', note: 'лише потрібні модулі стилів' },
  { name: 'Vite, Vitest, ESLint', note: 'збірка, тести, якість коду' },
]
</script>

<template>
  <div class="card">
    <div class="card-body">
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

      <a class="btn btn-primary" :href="REPOSITORY_URL" target="_blank" rel="noopener">
        <i class="bi bi-github"></i> Проєкт на GitHub
      </a>
    </div>
  </div>
</template>

<style scoped>
.page-title {
  margin-bottom: 8px;
  font-size: 1.5rem;
  font-weight: 700;
}

.lead-text {
  color: #666;
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
  color: #98a6ad;
}
</style>
