import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RegistrationForm from '../RegistrationForm.vue'
import type { Participant } from '../../types/Participant'

const existing: Participant = {
  id: 1,
  name: 'Іван',
  dob: '1999-03-01',
  email: 'ivan@example.com',
  phone: '+380501234567',
}

async function fill(wrapper: ReturnType<typeof mount>, values: string[]) {
  const inputs = wrapper.findAll('input')
  for (const [index, value] of values.entries()) {
    await inputs[index]?.setValue(value)
  }
}

describe('RegistrationForm', () => {
  it('emits the participant and clears the form without showing errors', async () => {
    const wrapper = mount(RegistrationForm, { props: { participants: [] } })
    await fill(wrapper, [' Олена ', '2000-05-12', 'olena@example.com', '+380671234567'])

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('register')?.[0]).toEqual([
      { name: 'Олена', dob: '2000-05-12', email: 'olena@example.com', phone: '+380671234567' },
    ])
    expect(wrapper.findAll('input').every((input) => input.element.value === '')).toBe(true)
    expect(wrapper.find('.invalid-feedback').exists()).toBe(false)
  })

  it('submits on Enter inside a field', async () => {
    const wrapper = mount(RegistrationForm, { props: { participants: [] } })
    await fill(wrapper, ['Олена', '2000-05-12', 'olena@example.com', '+380671234567'])

    await wrapper.findAll('input')[3]?.trigger('keyup.enter')

    expect(wrapper.emitted('register')).toHaveLength(1)
  })

  it('shows an error for a duplicate e-mail instead of emitting', async () => {
    const wrapper = mount(RegistrationForm, { props: { participants: [existing] } })
    await fill(wrapper, ['Іван', '1999-03-01', 'IVAN@example.com', '+380501234567'])

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('register')).toBeUndefined()
    expect(wrapper.text()).toContain('Учасник з такою поштою вже зареєстрований')
  })

  it('marks fields valid or invalid after the first save and re-checks them while typing', async () => {
    const wrapper = mount(RegistrationForm, { props: { participants: [] } })
    await fill(wrapper, ['Олена', '', '', ''])
    const inputs = () => wrapper.findAll('input')

    expect(inputs()[0]?.classes()).not.toContain('is-valid')

    await wrapper.get('button').trigger('click')
    expect(inputs()[0]?.classes()).toContain('is-valid')
    expect(inputs()[2]?.classes()).toContain('is-invalid')

    await inputs()[2]?.setValue('olena@example.com')
    expect(inputs()[2]?.classes()).toContain('is-valid')
  })
})
