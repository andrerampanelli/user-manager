import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from '../AppHeader.vue'

describe('AppHeader.vue', () => {
  it('renders the app title', () => {
    const wrapper = mount(AppHeader)
    expect(wrapper.text()).toContain('User Manager')
  })

  it('renders a link to /users', () => {
    const wrapper = mount(AppHeader)
    const link = wrapper.find('a[href="/users"]')
    expect(link.exists()).toBe(true)
    expect(link.text().toLowerCase()).toContain('users')
  })
}) 