<template>
  <RouterLink :to="{ name: 'home' }" class="logo" aria-label="Vue Lottery, на головну">
    <span class="logo__mark"><i class="bi bi-ticket-perforated"></i></span>
    <span class="logo__text">Vue <strong>Lottery</strong></span>
  </RouterLink>
</template>

<style scoped lang="scss">
.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--p-text-color);
  text-decoration: none;

  &__mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    color: var(--p-primary-contrast-color);
    font-size: 1.1rem;
    background-color: var(--p-primary-color);
    border-radius: 4px;
  }

  &__text {
    font-size: 1.1rem;
    letter-spacing: 0.02em;
  }
}
</style>
