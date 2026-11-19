<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  page: number
  total: number
  pageSize: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

// не більше семи кнопок: перша, остання, сусіди поточної й пропуски між ними
const pages = computed<(number | 'gap')[]>(() => {
  const count = pageCount.value
  if (count <= 7) {
    return Array.from({ length: count }, (_, i) => i + 1)
  }
  const current = Math.min(props.page, count)
  const start = Math.max(2, Math.min(current - 1, count - 4))
  const end = Math.min(count - 1, Math.max(current + 1, 5))
  const middle = Array.from({ length: end - start + 1 }, (_, i) => start + i)
  return [
    1,
    ...(start > 2 ? ['gap' as const] : []),
    ...middle,
    ...(end < count - 1 ? ['gap' as const] : []),
    count,
  ]
})

function go(target: number): void {
  if (target >= 1 && target <= pageCount.value && target !== props.page) {
    emit('change', target)
  }
}
</script>

<template>
  <nav v-if="pageCount > 1" aria-label="Сторінки списку">
    <ul class="pagination pagination-sm">
      <li class="page-item" :class="{ disabled: page <= 1 }">
        <button type="button" class="page-link" aria-label="Попередня" @click="go(page - 1)">
          <i class="bi bi-chevron-left"></i>
        </button>
      </li>
      <li
        v-for="(item, index) in pages"
        :key="`${item}-${index}`"
        class="page-item"
        :class="{ active: item === page, disabled: item === 'gap' }"
      >
        <span v-if="item === 'gap'" class="page-link">…</span>
        <button
          v-else
          type="button"
          class="page-link"
          :aria-current="item === page ? 'page' : undefined"
          @click="go(item)"
        >
          {{ item }}
        </button>
      </li>
      <li class="page-item" :class="{ disabled: page >= pageCount }">
        <button type="button" class="page-link" aria-label="Наступна" @click="go(page + 1)">
          <i class="bi bi-chevron-right"></i>
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.pagination {
  margin: 0;
}
</style>
