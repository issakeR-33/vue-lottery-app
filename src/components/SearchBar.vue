<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits<{
  'filter-by-name': [value: string]
}>()

const query = ref('')
let debounceTimer: ReturnType<typeof setTimeout> | undefined

watch(query, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('filter-by-name', value.trim())
  }, 300)
})
</script>

<template>
  <input
    v-model="query"
    type="text"
    class="form-control search-bar"
    placeholder="Пошук за іменем..."
  />
</template>

<style scoped>
.search-bar {
  max-width: 280px;
}
</style>
