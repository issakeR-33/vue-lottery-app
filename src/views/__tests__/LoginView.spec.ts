import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'
import LoginView from '../LoginView.vue'
import { ServiceProvider } from '@/services/service-provider'
import { FakeAuthService } from '@/services/__tests__/fake-auth.service'
import { useAuthStore } from '@/stores/auth'

let router: Router

async function mountLogin(url = '/login') {
  router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/login', name: 'login', component: LoginView },
      { path: '/users', name: 'users', component: { template: '<div />' } },
      { path: '/users/:id', name: 'user', component: { template: '<div />' } },
    ],
  })
  await router.push(url)
  return mount(LoginView, { global: { plugins: [router] } })
}

async function submit(
  wrapper: Awaited<ReturnType<typeof mountLogin>>,
  username: string,
  password: string,
) {
  const [userInput, passwordInput] = wrapper.findAll('input')
  await userInput?.setValue(username)
  await passwordInput?.setValue(password)
  await wrapper.find('form').trigger('submit')
  // VeeValidate перевіряє схему асинхронно
  await new Promise((resolve) => setTimeout(resolve, 20))
  await flushPromises()
}

describe('LoginView', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    ServiceProvider.override({ auth: new FakeAuthService() })
  })

  afterEach(() => {
    ServiceProvider.reset()
  })

  it('validates the fields before calling the API', async () => {
    const wrapper = await mountLogin()

    await submit(wrapper, '', '123')

    expect(wrapper.text()).toContain("Обов'язкове поле")
    expect(wrapper.text()).toContain('Щонайменше 6 символів')
    expect(useAuthStore().isAuthenticated).toBe(false)
  })

  it('shows the authorization error inside the form', async () => {
    const wrapper = await mountLogin()

    await submit(wrapper, 'emilys', 'wrongpass')

    expect(wrapper.find('.alert-danger').text()).toBe('Невірний логін або пароль')
  })

  it('returns to the requested page after a successful login', async () => {
    const wrapper = await mountLogin('/login?redirect=/users/5')

    await submit(wrapper, 'emilys', 'emilyspass')

    expect(useAuthStore().isAuthenticated).toBe(true)
    expect(router.currentRoute.value.fullPath).toBe('/users/5')
  })

  it('opens the users list when there is no redirect', async () => {
    const wrapper = await mountLogin()

    await submit(wrapper, 'emilys', 'emilyspass')

    expect(router.currentRoute.value.name).toBe('users')
  })
})
