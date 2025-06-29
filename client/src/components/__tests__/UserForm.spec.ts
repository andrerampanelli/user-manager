import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UserForm from '../UserForm.vue'

function mountForm(props = {}) {
  return mount(UserForm, {
    props: { ...props },
  })
}

describe('UserForm.vue', () => {
  it('shows validation errors for empty fields', async () => {
    const wrapper = mountForm()
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('Name is required')
    expect(wrapper.text()).toContain('Email is required')
    expect(wrapper.text()).toContain('Age is required')
  })

  it('shows error for invalid email', async () => {
    const wrapper = mountForm()
    await wrapper.find('input[autocomplete="off"]').setValue('not-an-email')
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('Email must be valid')
  })

  it('shows error for age <= 18', async () => {
    const wrapper = mountForm()
    await wrapper.findAll('input[autocomplete="off"]')[0].setValue('Test')
    await wrapper.findAll('input[autocomplete="off"]')[1].setValue('test@example.com')
    await wrapper.find('input[type="number"]').setValue(17)
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('Age must be greater than 18')
  })

  it('emits submit with valid data', async () => {
    const wrapper = mountForm()
    await wrapper.findAll('input[autocomplete="off"]')[0].setValue('Test User')
    await wrapper.findAll('input[autocomplete="off"]')[1].setValue('test@example.com')
    await wrapper.find('input[type="number"]').setValue(25)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')![0][0]).toEqual({ name: 'Test User', email: 'test@example.com', age: 25 })
  })
}) 