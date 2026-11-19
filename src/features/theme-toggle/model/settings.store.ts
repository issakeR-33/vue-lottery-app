import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

export type Theme = 'light' | 'dark'

// клас, за яким PrimeVue вмикає темну тему (darkModeSelector в app/providers/ui.ts)
export const DARK_CLASS = 'app-dark'

// Налаштування інтерфейсу. На відміну від session.store, у localStorage їх зберігає
// плагін pinia-plugin-persistedstate: досить опції persist, без ручних setItem/getItem.
export const useSettingsStore = defineStore(
  'settings',
  () => {
    const theme = ref<Theme>('light')

    const isDark = computed(() => theme.value === 'dark')

    function toggleTheme(): void {
      theme.value = isDark.value ? 'light' : 'dark'
    }

    // тема застосовується до <html> одразу і після кожної зміни (зокрема після відновлення плагіном)
    watch(
      theme,
      (value) => {
        document.documentElement.classList.toggle(DARK_CLASS, value === 'dark')
      },
      { immediate: true },
    )

    return { theme, isDark, toggleTheme }
  },
  {
    persist: {
      key: 'vue-lottery-settings',
      pick: ['theme'],
    },
  },
)
