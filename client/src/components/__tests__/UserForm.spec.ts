import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import UserForm from '../UserForm.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

function mountForm(props = {}) {
  return mount(UserForm, {
    props: { ...props },
    global: {
      plugins: [ElementPlus],
      stubs: {
        'el-icon': true,
        'ArrowLeftBold': true,
      },
    },
  })
}

describe('UserForm.vue', () => {
  it('shows validation errors for empty fields', async () => {
    const wrapper = mountForm()
    const inputs = wrapper.findAll('input')
    for (const input of inputs) {
      await input.trigger('blur')
    }
    await wrapper.find('button').trigger('click')
    await flushPromises()
    expect(wrapper.findAll('.el-form-item.is-error').length).toBeGreaterThan(0)
  })

  it('shows error for invalid email', async () => {
    const wrapper = mountForm()
    await wrapper.find('input[autocomplete="off"]').setValue('not-an-email')
    const inputs = wrapper.findAll('input')
    for (const input of inputs) {
      await input.trigger('blur')
    }
    await wrapper.find('button').trigger('click')
    await flushPromises()
    expect(wrapper.findAll('.el-form-item.is-error').length).toBeGreaterThan(0)
  })

  it('emits submit with valid data', async () => {
    const wrapper = mountForm()
    await wrapper.findAll('input[autocomplete="off"]')[0].setValue('Test User')
    await wrapper.findAll('input[autocomplete="off"]')[1].setValue('test@example.com')
    await wrapper.find('input[type="number"]').setValue(25)
    const inputs = wrapper.findAll('input')
    for (const input of inputs) {
      await input.trigger('blur')
    }
    await wrapper.find('button').trigger('click')
    await flushPromises()
    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')![0][0]).toEqual({ name: 'Test User', email: 'test@example.com', age: 25 })
  })

  it('clamps age input to min value 18 if set below', async () => {
    const wrapper = mountForm()
    const numberInput = wrapper.find('input[type="number"]')
    await numberInput.setValue(17)
    await numberInput.trigger('input')
    await numberInput.trigger('blur')
    await flushPromises()
    expect((numberInput.element as HTMLInputElement).value).toBe('18')
  })

  it('does not decrease age below 18 using the decrease button', async () => {
    const wrapper = mountForm()
    const numberInput = wrapper.find('input[type="number"]')
    // Try to decrease below 18
    const decreaseBtn = wrapper.find('.el-input-number__decrease')
    await decreaseBtn.trigger('click')
    await flushPromises()
    expect((numberInput.element as HTMLInputElement).value).toBe('18')
  })
}) 