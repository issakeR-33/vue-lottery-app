<script setup lang="ts" generic="T extends { id: number }">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

export interface AppTableColumn {
  field: string
  header: string
  /** Додатковий клас для заголовка й комірок колонки. */
  class?: string
}

defineProps<{
  rows: T[]
  columns: AppTableColumn[]
  loading?: boolean
}>()

// вміст комірки можна замінити слотом cell-<field>, інакше показується значення поля
defineSlots<
  {
    [K in `cell-${string}`]?: (props: { row: T; index: number }) => unknown
  } & {
    empty?: () => unknown
  }
>()

function valueOf(row: T, field: string): unknown {
  return (row as Record<string, unknown>)[field]
}
</script>

<template>
  <DataTable :value="rows" data-key="id" :loading="loading" class="app-table" scrollable>
    <Column
      v-for="column in columns"
      :key="column.field"
      :field="column.field"
      :header="column.header"
      :header-class="column.class"
      :body-class="column.class"
    >
      <template #body="{ data, index }">
        <slot :name="`cell-${column.field}`" :row="data as T" :index="index">
          {{ valueOf(data as T, column.field) }}
        </slot>
      </template>
    </Column>
    <template #empty>
      <slot name="empty" />
    </template>
  </DataTable>
</template>
