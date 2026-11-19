<template>
  <div class="card">
    <div class="card-body not-found">
      <p class="not-found__code">404</p>
      <h1 class="not-found__title">Сторінку не знайдено</h1>
      <p class="not-found__text">Такої адреси в застосунку немає.</p>
      <RouterLink :to="{ name: 'home' }" class="btn btn-primary">На головну</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  padding: 48px 16px;
  text-align: center;
}

.not-found__code {
  margin: 0;
  color: var(--bs-primary);
  font-size: 4rem;
  font-weight: 700;
  line-height: 1;
}

.not-found__title {
  margin: 12px 0 4px;
  font-size: 1.25rem;
  font-weight: 700;
}

.not-found__text {
  color: #98a6ad;
}
</style>
