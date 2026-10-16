import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import UsersView from '../UsersView.vue'
import type { Participant } from '@/types/Participant'

const STORAGE_KEY = 'vue-lottery-participants'

function participant(id: number): Participant {
  return {
    id,
    name: `Учасник ${id}`,
    dob: '2000-01-01',
    email: `p${id}@example.com`,
    phone: '+380501234567',
  }
}

function newWinnerButton(wrapper: ReturnType<typeof mount>) {
  const button = wrapper.findAll('button').find((b) => b.text() === 'New winner')
  if (!button) throw new Error('New winner button not found')
  return button
}

describe('UsersView', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('disables New winner while there are no participants', () => {
    const wrapper = mount(UsersView)
    expect(newWinnerButton(wrapper).attributes('disabled')).toBeDefined()
  })

  it('restores participants from localStorage and picks at most three unique winners', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3, 4, 5].map(participant)))
    const wrapper = mount(UsersView)
    const button = newWinnerButton(wrapper)

    for (let i = 0; i < 5; i++) {
      await button.trigger('click')
    }

    const chips = wrapper.findAll('.winner-chip').map((chip) => chip.text())
    expect(chips).toHaveLength(3)
    expect(new Set(chips).size).toBe(3)
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('saves a newly registered participant to localStorage', async () => {
    const wrapper = mount(UsersView)
    const inputs = wrapper.findAll('.form-card input')
    const values = ['Олена', '2000-05-12', 'olena@example.com', '+380671234567']
    for (const [index, value] of values.entries()) {
      await inputs[index]?.setValue(value)
    }

    await wrapper
      .findAll('button')
      .find((b) => b.text() === 'Save')
      ?.trigger('click')
    await flushPromises()

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Participant[]
    expect(saved).toEqual([
      {
        id: 1,
        name: 'Олена',
        dob: '2000-05-12',
        email: 'olena@example.com',
        phone: '+380671234567',
      },
    ])
  })
})
