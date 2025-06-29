import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import UserFormPage from '../UserFormPage.vue'
import * as userApi from '@/api/user'
import ElementPlus from 'element-plus'
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

vi.mock('@/api/user')

const user = { name: 'Alice', email: 'alice@example.com', age: 25 }

function makeRouter(initialPath = '/users/new') {
  const routes = [
    { path: '/users/new', name: 'UserCreate', component: UserFormPage },
    { path: '/users/:id/edit', name: 'UserEdit', component: UserFormPage, props: true },
    { path: '/users', name: 'UserList', component: { template: '<div />' } },
  ]
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })
  router.push(initialPath)
  return router.isReady().then(() => router)
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetAllMocks()
  vi.spyOn(ElMessage, 'error').mockImplementation(() => ({ close: () => {} }))
  vi.spyOn(ElMessage, 'success').mockImplementation(() => ({ close: () => {} }))
})

describe('UserFormPage.vue', () => {
  it('creates a user on submit in add mode', async () => {
    vi.spyOn(userApi, 'createUser').mockResolvedValue({ id: 1, ...user })
    const router = await makeRouter('/users/new')
    vi.spyOn(router, 'push')
    const wrapper = mount(UserFormPage, {
      global: {
        plugins: [ElementPlus, router],
        components: { ArrowLeftBold },
      },
    })
    await flushPromises()
    // Fill form
    await wrapper.findAll('input[autocomplete="off"]')[0].setValue(user.name)
    await wrapper.findAll('input[autocomplete="off"]')[0].trigger('blur')
    await flushPromises()
    await wrapper.findAll('input[autocomplete="off"]')[1].setValue(user.email)
    await wrapper.findAll('input[autocomplete="off"]')[1].trigger('blur')
    await flushPromises()
    await wrapper.find('input[type="number"]').setValue(user.age)
    await wrapper.find('input[type="number"]').trigger('blur')
    await flushPromises()
    const buttons = wrapper.findAll('button')
    await buttons[buttons.length - 1].trigger('click')
    await flushPromises()
    await flushPromises()
    expect(userApi.createUser).toHaveBeenCalledWith(user)
    expect(router.push).toHaveBeenCalledWith({ name: 'UserList' })
  })

  it('updates a user on submit in edit mode', async () => {
    vi.spyOn(userApi, 'getUser').mockResolvedValue(user)
    vi.spyOn(userApi, 'updateUser').mockResolvedValue({ id: 2, ...user })
    const router = await makeRouter('/users/2/edit')
    vi.spyOn(router, 'push')
    const wrapper = mount(UserFormPage, {
      global: {
        plugins: [ElementPlus, router],
        components: { ArrowLeftBold },
      },
    })
    await flushPromises()
    // Fill form
    await wrapper.findAll('input[autocomplete="off"]')[0].setValue(user.name)
    await wrapper.findAll('input[autocomplete="off"]')[0].trigger('blur')
    await flushPromises()
    await wrapper.findAll('input[autocomplete="off"]')[1].setValue(user.email)
    await wrapper.findAll('input[autocomplete="off"]')[1].trigger('blur')
    await flushPromises()
    await wrapper.find('input[type="number"]').setValue(user.age)
    await wrapper.find('input[type="number"]').trigger('blur')
    await flushPromises()
    const buttons = wrapper.findAll('button')
    await buttons[buttons.length - 1].trigger('click')
    await flushPromises()
    await flushPromises()
    expect(userApi.updateUser).toHaveBeenCalledWith(2, user)
    expect(router.push).toHaveBeenCalledWith({ name: 'UserList' })
  })

  it('shows error if createUser fails', async () => {
    vi.spyOn(userApi, 'createUser').mockRejectedValue({ response: { data: { error: 'fail' } } })
    const router = await makeRouter('/users/new')
    vi.spyOn(router, 'push')
    const wrapper = mount(UserFormPage, {
      global: {
        plugins: [ElementPlus, router],
        components: { ArrowLeftBold },
      },
    })
    await flushPromises()
    await wrapper.findAll('input[autocomplete="off"]')[0].setValue(user.name)
    await wrapper.findAll('input[autocomplete="off"]')[0].trigger('blur')
    await flushPromises()
    await wrapper.findAll('input[autocomplete="off"]')[1].setValue(user.email)
    await wrapper.findAll('input[autocomplete="off"]')[1].trigger('blur')
    await flushPromises()
    await wrapper.find('input[type="number"]').setValue(user.age)
    await wrapper.find('input[type="number"]').trigger('blur')
    await flushPromises()
    const buttons = wrapper.findAll('button')
    await buttons[buttons.length - 1].trigger('click')
    await flushPromises()
    await flushPromises()
    expect(ElMessage.error).toHaveBeenCalledWith('fail')
  })
}) 