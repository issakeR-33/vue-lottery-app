import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from '../SearchBar.vue'

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('emits filter-by-name once, 300 ms after the last keystroke', async () => {
    const wrapper = mount(SearchBar)
    const input = wrapper.get('input')

    await input.setValue('ол')
    vi.advanceTimersByTime(200)
    await input.setValue('олена ')
    vi.advanceTimersByTime(299)
    expect(wrapper.emitted('filter-by-name')).toBeUndefined()

    vi.advanceTimersByTime(1)
    expect(wrapper.emitted('filter-by-name')).toEqual([['олена']])
  })
})
