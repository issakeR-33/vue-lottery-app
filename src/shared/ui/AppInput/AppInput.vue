<script setup lang="ts">
import { useId } from 'vue'
import InputText from 'primevue/inputtext'

// решта атрибутів (autocomplete, min, onBlur від VeeValidate) потрапляє на сам input
defineOptions({ inheritAttrs: false })

defineProps<{
  label: string
  type?: string
  placeholder?: string
  /** Текст помилки валідації, показується під полем. */
  error?: string
  /** Підсвітити поле як правильне (після першої спроби надіслати форму). */
  valid?: boolean
}>()

const model = defineModel<string | number | undefined>({ required: true })

const inputId = useId()
const errorId = useId()
</script>

<template>
  <div class="app-field">
    <label class="app-field__label" :for="inputId">{{ label }}</label>
    <InputText
      :id="inputId"
      v-model="model as string | undefined"
      v-bind="$attrs"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      :invalid="Boolean(error)"
      :class="{ 'app-field__input--valid': valid && !error }"
      :aria-describedby="error ? errorId : undefined"
      fluid
    />
    <small v-if="error" :id="errorId" class="app-field__error">{{ error }}</small>
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
