import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import AppConfirmDialog from '../AppConfirmDialog.vue'

function buttons(): HTMLButtonElement[] {
  return Array.from(document.querySelectorAll('button'))
}

describe('AppConfirmDialog', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  // Dialog монтується в body через Portal лише після mounted, тому чекаємо рендер
  async function mountOpen() {
    const wrapper = mount(AppConfirmDialog, {
      props: { visible: true, header: 'Видалення учасника' },
      slots: { default: 'Ви дійсно бажаєте видалити учасника?' },
      global: { plugins: [PrimeVue] },
      attachTo: document.body,
    })
    await flushPromises()
    return wrapper
  }

  it('renders the header and the message', async () => {
    await mountOpen()
    expect(document.body.textContent).toContain('Видалення учасника')
    expect(document.body.textContent).toContain('Ви дійсно бажаєте видалити учасника?')
  })

  it('emits confirm on "Так"', async () => {
    const wrapper = await mountOpen()
    buttons()
      .find((b) => b.textContent?.trim() === 'Так')
      ?.click()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
  })

  it('closes on "Ні" without confirming', async () => {
    const wrapper = await mountOpen()
    buttons()
      .find((b) => b.textContent?.trim() === 'Ні')
      ?.click()
    expect(wrapper.emitted('update:visible')).toEqual([[false]])
    expect(wrapper.emitted('confirm')).toBeUndefined()
  })
})
