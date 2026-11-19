<script setup lang="ts">
import { AppButton, AppCard } from '@/shared/ui'

const student = {
  fullName: 'Мельник Іван Іванович',
  group: 'Група 343А(1)',
  university: 'Чернівецький національний університет імені Юрія Федьковича',
  github: 'https://github.com/issakeR-33',
}

const skills = [
  { area: 'Frontend', items: ['HTML5', 'CSS3 / SCSS', 'JavaScript (ES2023)', 'TypeScript'] },
  { area: 'Фреймворки', items: ['Vue 3', 'Vue Router', 'Pinia', 'PrimeVue'] },
  {
    area: 'Інструменти',
    items: ['Git, GitHub Actions', 'Vite, webpack', 'ESLint, Prettier', 'Vitest'],
  },
]
</script>

<template>
  <AppCard>
    <h1 class="page-title">{{ student.fullName }}</h1>
    <p class="subtitle">{{ student.group }} · {{ student.university }}</p>

    <h2 class="section-title">Technical skills</h2>
    <div class="skills">
      <section v-for="group in skills" :key="group.area" class="skills__group">
        <h3 class="skills__area">{{ group.area }}</h3>
        <ul class="skills__list">
          <li v-for="skill in group.items" :key="skill" class="skills__item">{{ skill }}</li>
        </ul>
      </section>
    </div>

    <AppButton label="GitHub" icon="bi bi-github" :href="student.github" />
  </AppCard>
</template>

<style scoped>
.page-title {
  margin-bottom: 4px;
  font-size: 1.5rem;
  font-weight: 700;
}

.subtitle {
  color: var(--p-text-muted-color);
}

.section-title {
  margin: 24px 0 12px;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
}

.skills {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.skills__area {
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--p-text-muted-color);
}

.skills__list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.skills__item {
  padding: 2px 8px;
  color: var(--p-primary-color);
  font-size: 0.85rem;
  border: 1px solid var(--p-primary-color);
  border-radius: 2px;
}
</style>
