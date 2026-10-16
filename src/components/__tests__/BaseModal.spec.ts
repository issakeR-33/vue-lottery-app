import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseModal from '../BaseModal.vue'

describe('BaseModal', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  function mountOpen() {
    return mount(BaseModal, {
      props: { modelValue: true },
      slots: {
        header: '<h5>Заголовок</h5>',
        default: '<p>Тіло</p>',
        footer: '<button>Ок</button>',
      },
      attachTo: document.body,
    })
  }

  it('renders the header, body and footer slots', () => {
    mountOpen()
    expect(document.body.textContent).toContain('Заголовок')
    expect(document.body.textContent).toContain('Тіло')
    expect(document.body.textContent).toContain('Ок')
  })

  it('closes on Esc', async () => {
    const wrapper = mountOpen()
    document.querySelector('.modal')?.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }))
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('closes on the backdrop click', () => {
    const wrapper = mountOpen()
    ;(document.querySelector('.modal-backdrop-custom') as HTMLElement).click()
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })
})
