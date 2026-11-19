import './styles/main.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import { router } from './providers/router'
import { useSessionStore } from '@/entities/session'
import { useSettingsStore } from '@/features/theme-toggle'
import { installAuthInterceptor } from './providers/auth-interceptor'
import { registerServices } from './providers/services'
import { installUi } from './providers/ui'

// сервіси реєструються до першого звернення сторів до ServiceProvider
registerServices()

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
installUi(app)

// збережена тема застосовується ще до першого рендеру
useSettingsStore(pinia)

const session = useSessionStore(pinia)
installAuthInterceptor(session, router)

app.use(router)
app.mount('#app')

// збережену сесію перевіряємо запитом до захищеного /auth/me
if (session.isAuthenticated) {
  session.fetchMe().catch(() => {
    // протермінований токен обробляє interceptor, решта помилок не критична
  })
}
