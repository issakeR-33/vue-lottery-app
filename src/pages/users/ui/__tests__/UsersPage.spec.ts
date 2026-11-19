import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import UsersPage from '../UsersPage.vue'
import { ServiceProvider } from '@/shared/api'
import { USER_SERVICE } from '@/entities/user'
import { FakeUserService, makeUser } from '@/entities/user/api/__tests__/fake-user.service'

let service: FakeUserService
let router: Router

async function mountAt(url: string) {
  router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/users', name: 'users', component: UsersPage },
      {
        path: '/users/:id',
        name: 'user',
        component: { template: '<div />' },
        children: [{ path: 'edit', name: 'user-edit', component: { template: '<div />' } }],
      },
    ],
  })
  await router.push(url)
  const wrapper = mount(UsersPage, { global: { plugins: [router, PrimeVue, ToastService] } })
  await flushPromises()
  return wrapper
}

function rowNames(wrapper: Awaited<ReturnType<typeof mountAt>>) {
  return wrapper.findAll('tbody tr').map((row) => row.findAll('td')[1]?.text())
}

describe('UsersPage', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    service = new FakeUserService(Array.from({ length: 25 }, (_, i) => makeUser(i + 1)))
    ServiceProvider.register(USER_SERVICE, () => service)
  })

  afterEach(() => {
    ServiceProvider.reset()
  })

  it('reads the page from the query and renders that slice of users', async () => {
    const wrapper = await mountAt('/users?page=2')

    expect(rowNames(wrapper)[0]).toBe('First11 Last11')
    expect(wrapper.findAll('tbody tr')).toHaveLength(10)
    expect(wrapper.find('.p-paginator-page-selected').text()).toBe('2')
  })

  it('writes the page number to the URL when the pagination is clicked', async () => {
    const wrapper = await mountAt('/users')

    const third = wrapper.findAll('.p-paginator-page').find((b) => b.text() === '3')
    await third?.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.query.page).toBe('3')
    expect(rowNames(wrapper)[0]).toBe('First21 Last21')
  })

  it('searches through the repository when q is in the URL', async () => {
    const wrapper = await mountAt('/users?q=First12')

    expect(service.calls).toContain('search:First12')
    expect(rowNames(wrapper)).toEqual(['First12 Last12'])
  })

  it('shows the error state when the API fails', async () => {
    service.getAll = async () => {
      throw new Error('HTTP 500: Internal Server Error')
    }
    const wrapper = await mountAt('/users')

    expect(wrapper.find('[role="alert"]').text()).toContain('HTTP 500')
  })

  it('picks at most three unique winners from the current page', async () => {
    const wrapper = await mountAt('/users')
    const button = wrapper.findAll('button').find((b) => b.text() === 'New winner')

    for (let i = 0; i < 5; i++) {
      await button?.trigger('click')
    }

    const chips = wrapper.findAll('.winner-chip').map((chip) => chip.text())
    expect(chips).toHaveLength(3)
    expect(new Set(chips).size).toBe(3)
    expect(button?.attributes('disabled')).toBeDefined()
  })
})
