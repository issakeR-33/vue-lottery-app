import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'
import UsersView from '../UsersView.vue'
import { ServiceProvider } from '@/services/service-provider'
import { FakeUserService, makeUser } from '@/services/__tests__/fake-user.service'

let service: FakeUserService
let router: Router

async function mountAt(url: string) {
  router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/users', name: 'users', component: UsersView },
      { path: '/users/:id', name: 'user', component: { template: '<div />' } },
    ],
  })
  await router.push(url)
  const wrapper = mount(UsersView, { global: { plugins: [router] } })
  await flushPromises()
  return wrapper
}

function rowNames(wrapper: Awaited<ReturnType<typeof mountAt>>) {
  return wrapper.findAll('tbody tr').map((row) => row.findAll('td')[1]?.text())
}

describe('UsersView', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    service = new FakeUserService(Array.from({ length: 25 }, (_, i) => makeUser(i + 1)))
    ServiceProvider.override({ users: service })
  })

  afterEach(() => {
    ServiceProvider.reset()
  })

  it('reads the page from the query and renders that slice of users', async () => {
    const wrapper = await mountAt('/users?page=2')

    expect(rowNames(wrapper)[0]).toBe('First11 Last11')
    expect(wrapper.findAll('tbody tr')).toHaveLength(10)
    expect(wrapper.find('.page-item.active').text()).toBe('2')
  })

  it('writes the page number to the URL when the pagination is clicked', async () => {
    const wrapper = await mountAt('/users')

    const third = wrapper.findAll('.page-link').find((b) => b.text() === '3')
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

    expect(wrapper.find('.alert-danger').text()).toContain('HTTP 500')
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
