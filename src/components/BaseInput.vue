<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  label: string
  type?: string
  placeholder?: string
  max?: string
  error?: string
}>()

const model = defineModel<string>({ required: true })
const inputId = useId()
</script>

<template>
  <div class="field">
    <label class="form-label" :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      v-model="model"
      :type="type ?? 'text'"
      class="form-control"
      :class="{ 'is-invalid': error }"
      :placeholder="placeholder"
      :max="max"
      :aria-invalid="Boolean(error)"
    />
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>

<style scoped>
.field {
  margin-bottom: 20px;
}

.field label {
  font-weight: 500;
  margin-bottom: 6px;
}
</style>
