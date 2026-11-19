<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { User } from '@/entities/user'
import { AppButton, AppCard } from '@/shared/ui'
import { useWinnersStore } from '../model/winners.store'
import WinnerItem from './WinnerItem.vue'

// учасники, серед яких обирається переможець (поточна сторінка таблиці)
const props = defineProps<{
  pool: readonly User[]
}>()

const store = useWinnersStore()
const { winners } = storeToRefs(store)
const { pick, remove, canPick } = store
</script>

<template>
  <AppCard>
    <div class="winners">
      <!-- поле переможців у вигляді поля вводу з тегами, як на дизайні -->
      <div class="winners__list">
        <WinnerItem v-for="winner in winners" :key="winner.id" :winner="winner" @remove="remove" />
        <span class="winners__placeholder">Winners</span>
      </div>
      <AppButton label="New winner" :disabled="!canPick(props.pool)" @click="pick(props.pool)" />
    </div>
  </AppCard>
</template>

<style scoped lang="scss">
.winners {
  display: flex;
  align-items: center;
  gap: 22px;

  &__list {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    align-items: center;
    gap: 5px;
    min-height: 38px;
    padding: 4px 7px;
    background-color: var(--p-form-field-background);
    border: 1px solid var(--p-form-field-border-color);
    border-radius: 4px;
  }

  &__placeholder {
    padding: 0 4px;
    color: var(--p-form-field-placeholder-color);
  }
}
</style>
