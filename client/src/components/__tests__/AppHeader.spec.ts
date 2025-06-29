import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from '../AppHeader.vue'
import ElementPlus from 'element-plus'

describe('AppHeader.vue', () => {
  it('renders the app title', () => {
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [ElementPlus],
        stubs: { 'router-link': true },
      },
    })
    expect(wrapper.text()).toContain('User Manager')
  })

  it('renders a link to /users', () => {
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [ElementPlus],
        stubs: { 'router-link': true },
      },
    })
    expect(wrapper.html().toLowerCase()).toContain('<router-link-stub to="/users"')
  })
}) 