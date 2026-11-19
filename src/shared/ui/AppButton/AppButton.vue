<script setup lang="ts">
import Button from 'primevue/button'
import type { RouteLocationRaw } from 'vue-router'

withDefaults(
  defineProps<{
    label?: string
    type?: 'button' | 'submit'
    severity?: 'primary' | 'secondary' | 'danger'
    variant?: 'outlined' | 'text'
    size?: 'small'
    /** Клас іконки Bootstrap Icons, наприклад "bi bi-trash". */
    icon?: string
    loading?: boolean
    disabled?: boolean
    /** Якщо задано, кнопка стає посиланням RouterLink. */
    to?: RouteLocationRaw
  }>(),
  {
    type: 'button',
    severity: 'primary',
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <Button
    v-if="to"
    as="router-link"
    :to="to"
    :label="label"
    :icon="icon"
    :severity="severity === 'primary' ? undefined : severity"
    :variant="variant"
    :size="size"
    :disabled="disabled"
  >
    <!-- свій вміст передаємо лише якщо він є, інакше PrimeVue сам малює icon і label -->
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </Button>
  <Button
    v-else
    :type="type"
    :label="label"
    :icon="icon"
    :loading="loading"
    :severity="severity === 'primary' ? undefined : severity"
    :variant="variant"
    :size="size"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <!-- свій вміст передаємо лише якщо він є, інакше PrimeVue сам малює icon і label -->
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </Button>
</template>
