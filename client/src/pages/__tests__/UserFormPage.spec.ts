import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import UserFormPage from '../UserFormPage.vue'
import * as userApi from '@/api/user'

vi.mock('@/api/user')

const user = { name: 'Alice', email: 'alice@example.com', age: 25 }

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetAllMocks()
})

describe('UserFormPage.vue', () => {
  it('creates a user on submit in add mode', async () => {
    vi.spyOn(userApi, 'createUser').mockResolvedValue({ id: 1, ...user })
    const wrapper = mount(UserFormPage, {
      global: { mocks: { $route: { params: {} }, $router: { push: vi.fn() } } },
    })
    await flushPromises()
    // Fill form
    await wrapper.findAll('input[autocomplete="off"]')[0].setValue(user.name)
    await wrapper.findAll('input[autocomplete="off"]')[1].setValue(user.email)
    await wrapper.find('input[type="number"]').setValue(user.age)
    await wrapper.find('button').trigger('click')
    await flushPromises()
    expect(userApi.createUser).toHaveBeenCalledWith(user)
  })

  it('updates a user on submit in edit mode', async () => {
    vi.spyOn(userApi, 'getUser').mockResolvedValue(user)
    vi.spyOn(userApi, 'updateUser').mockResolvedValue({ id: 2, ...user })
    const wrapper = mount(UserFormPage, {
      global: { mocks: { $route: { params: { id: 2 } }, $router: { push: vi.fn() } } },
    })
    await flushPromises()
    // Fill form
    await wrapper.findAll('input[autocomplete="off"]')[0].setValue(user.name)
    await wrapper.findAll('input[autocomplete="off"]')[1].setValue(user.email)
    await wrapper.find('input[type="number"]').setValue(user.age)
    await wrapper.find('button').trigger('click')
    await flushPromises()
    expect(userApi.updateUser).toHaveBeenCalledWith(2, user)
  })

  it('shows error if createUser fails', async () => {
    vi.spyOn(userApi, 'createUser').mockRejectedValue({ response: { data: { error: 'fail' } } })
    const wrapper = mount(UserFormPage, {
      global: { mocks: { $route: { params: {} }, $router: { push: vi.fn() } } },
    })
    await flushPromises()
    await wrapper.findAll('input[autocomplete="off"]')[0].setValue(user.name)
    await wrapper.findAll('input[autocomplete="off"]')[1].setValue(user.email)
    await wrapper.find('input[type="number"]').setValue(user.age)
    await wrapper.find('button').trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('fail')
  })
}) 