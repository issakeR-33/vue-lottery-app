import './assets/main.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { useAuthStore } from './stores/auth'
import { installAuthInterceptor } from './plugins/auth-interceptor'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

const auth = useAuthStore(pinia)
installAuthInterceptor(auth, router)

app.use(router)
app.mount('#app')

// збережену сесію перевіряємо запитом до захищеного /auth/me
if (auth.isAuthenticated) {
  auth.fetchMe().catch(() => {
    // протермінований токен обробляє interceptor, решта помилок не критична
  })
}
