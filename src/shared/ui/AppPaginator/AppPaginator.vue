<script setup lang="ts">
import Paginator, { type PageState } from 'primevue/paginator'

const props = defineProps<{
  /** Поточна сторінка, починаючи з 1. */
  page: number
  total: number
  pageSize: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

// Paginator рахує сторінки з нуля
function onPage(state: PageState): void {
  if (state.page + 1 !== props.page) emit('change', state.page + 1)
}
</script>

<template>
  <Paginator
    v-if="total > pageSize"
    :first="(page - 1) * pageSize"
    :rows="pageSize"
    :total-records="total"
    :page-link-size="5"
    class="app-paginator"
    @page="onPage"
  />
</template>
