<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { AppButton } from '@/shared/ui'
import { useSettingsStore } from '../model/settings.store'

const store = useSettingsStore()
const { isDark } = storeToRefs(store)
const { toggleTheme } = store
</script>

<template>
  <AppButton
    :icon="isDark ? 'bi bi-sun' : 'bi bi-moon-stars'"
    :aria-label="isDark ? 'Світла тема' : 'Темна тема'"
    :title="isDark ? 'Світла тема' : 'Темна тема'"
    severity="secondary"
    variant="text"
    size="small"
    @click="toggleTheme"
  />
</template>
