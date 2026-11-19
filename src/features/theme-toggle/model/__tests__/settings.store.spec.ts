import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp, nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { DARK_CLASS, useSettingsStore } from '../settings.store'

function installPinia() {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  createApp({}).use(pinia)
  setActivePinia(pinia)
}

describe('settings store', () => {
  beforeEach(() => {
    localStorage.clear()
    installPinia()
  })

  afterEach(() => {
    document.documentElement.classList.remove(DARK_CLASS)
  })

  it('switches the theme and the class on <html>', async () => {
    const store = useSettingsStore()
    expect(store.theme).toBe('light')
    store.toggleTheme()
    await nextTick()
    expect(store.isDark).toBe(true)
    expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(true)
  })

  it('remembers the theme in localStorage through the persist plugin', async () => {
    useSettingsStore().toggleTheme()
    await nextTick()
    expect(JSON.parse(localStorage.getItem('vue-lottery-settings') ?? '{}')).toEqual({
      theme: 'dark',
    })
    installPinia()
    expect(useSettingsStore().theme).toBe('dark')
  })
})
