<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  /** Початкове значення, наприклад з query-параметра q. */
  initial?: string
}>()

const emit = defineEmits<{
  'filter-by-name': [value: string]
}>()

const query = ref(props.initial ?? '')
let debounceTimer: ReturnType<typeof setTimeout> | undefined

watch(query, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('filter-by-name', value.trim())
  }, 300)
})

// синхронізація, коли q змінюється ззовні (кнопка "назад" у браузері)
watch(
  () => props.initial,
  (value) => {
    if ((value ?? '') !== query.value.trim()) {
      query.value = value ?? ''
    }
  },
)
</script>

<template>
  <input
    v-model="query"
    type="search"
    class="form-control search-bar"
    placeholder="Пошук за іменем..."
    aria-label="Пошук за іменем"
  />
</template>

<style scoped>
.search-bar {
  max-width: 280px;
}
</style>
