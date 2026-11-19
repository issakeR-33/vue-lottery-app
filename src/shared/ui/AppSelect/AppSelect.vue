<script setup lang="ts" generic="T extends string">
import { useId } from 'vue'
import Select from 'primevue/select'

defineOptions({ inheritAttrs: false })

defineProps<{
  label: string
  options: { label: string; value: T }[]
  placeholder?: string
  error?: string
  valid?: boolean
}>()

const model = defineModel<T | undefined>({ required: true })

const inputId = useId()
</script>

<template>
  <div class="app-field">
    <label class="app-field__label" :for="inputId">{{ label }}</label>
    <Select
      v-model="model"
      v-bind="$attrs"
      :input-id="inputId"
      :options="options"
      option-label="label"
      option-value="value"
      :placeholder="placeholder"
      :invalid="Boolean(error)"
      :class="{ 'app-field__input--valid': valid && !error }"
      fluid
    />
    <small v-if="error" class="app-field__error">{{ error }}</small>
  </div>
</template>

<style scoped lang="scss">
.app-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 14px;

  &__label {
    font-weight: 600;
  }

  &__error {
    color: var(--p-red-500);
    font-size: 0.75rem;
  }

  &__input--valid {
    border-color: var(--p-green-500);
  }
}
</style>
