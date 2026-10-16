<template>
  <RouterLink :to="{ name: 'home' }" class="logo" aria-label="Vue Lottery, на головну">
    <span class="logo__mark"><i class="bi bi-ticket-perforated"></i></span>
    <span class="logo__text">Vue <strong>Lottery</strong></span>
  </RouterLink>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #333;
  text-decoration: none;
}

.logo__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  color: #fff;
  font-size: 1.1rem;
  background-color: var(--bs-primary);
  border-radius: 4px;
}

.logo__text {
  font-size: 1.1rem;
  letter-spacing: 0.02em;
}
</style>
