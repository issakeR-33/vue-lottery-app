<script setup lang="ts">
import { useId } from 'vue'

// решта атрибутів (autocomplete, min, onBlur від VeeValidate) потрапляє на сам input
defineOptions({ inheritAttrs: false })

defineProps<{
  label: string
  type?: string
  placeholder?: string
  error?: string
  valid?: boolean
}>()

const model = defineModel<string | number | undefined>({ required: true })
const inputId = useId()
</script>

<template>
  <div class="field">
    <label class="form-label" :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      v-model="model"
      v-bind="$attrs"
      :type="type ?? 'text'"
      class="form-control"
      :class="{ 'is-invalid': error, 'is-valid': valid && !error }"
      :placeholder="placeholder"
      :aria-invalid="Boolean(error)"
    />
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>

<style scoped>
.field {
  margin-bottom: 14px;
}

.field label {
  font-weight: 600;
  margin-bottom: 4px;
}

.invalid-feedback {
  font-size: 0.75rem;
}
</style>
