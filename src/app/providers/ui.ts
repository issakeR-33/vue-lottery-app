import type { App } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'

// Основний колір з дизайну лабораторної (#3bafda) як палітра primary для теми Aura
const LotteryPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eef8fc',
      100: '#d5eef8',
      200: '#addcf1',
      300: '#82cbe9',
      400: '#5ebde2',
      500: '#3bafda',
      600: '#2a95bf',
      700: '#22789b',
      800: '#1d6280',
      900: '#1a5169',
      950: '#103446',
    },
  },
})

// Компоненти PrimeVue тут не реєструються глобально: кожна обгортка в shared/ui імпортує
// лише свій компонент, тому в бандл і в стилі потрапляє тільки те, що використано.
export function installUi(app: App): void {
  app.use(PrimeVue, {
    theme: {
      preset: LotteryPreset,
      options: {
        // темна тема вмикається класом на <html>, його ставить перемикач теми
        darkModeSelector: '.app-dark',
        cssLayer: false,
      },
    },
  })
  app.use(ToastService)
}
