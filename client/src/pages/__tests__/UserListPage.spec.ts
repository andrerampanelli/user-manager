import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import UserListPage from '../UserListPage.vue'
import * as userApi from '@/api/user'
import { createRouter, createWebHistory } from 'vue-router'
import { ElMessageBox } from 'element-plus'

vi.mock('@/api/user')

// Mock debounce to call immediately
vi.mock('lodash/debounce', () => ({
  default: (fn: any) => fn,
}))

const mockUsers = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 30 },
]

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetAllMocks()
  // @ts-expect-error
  vi.spyOn(ElMessageBox, 'confirm').mockResolvedValue('confirm')
})

describe('UserListPage.vue', () => {
  function mountPage() {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', name: 'Home', component: { template: '<div />' } }],
    })
    return mount(UserListPage, {
      global: {
        plugins: [router],
        stubs: {
          'el-input': true,
          'el-button': true,
          'el-alert': true,
          'el-skeleton': true,
          'UserTable': true,
        },
      },
    })
  }

  it('fetches and displays users', async () => {
    vi.spyOn(userApi, 'getUsers').mockResolvedValue({ users: mockUsers, total: 2, page: 1, limit: 10 })
    const wrapper = mountPage()
    await flushPromises()
    expect(userApi.getUsers).toHaveBeenCalled()
  })

  it('search input triggers getUsers', async () => {
    const getUsersMock = vi.spyOn(userApi, 'getUsers').mockResolvedValue({ users: mockUsers, total: 2, page: 1, limit: 10 })
    const wrapper = mountPage()
    await flushPromises()
    // Simulate search input event via DOM
    const input = wrapper.findComponent({ name: 'el-input' })
    await input.vm.$emit('input', 'Alice')
    await flushPromises()
    expect(getUsersMock).toHaveBeenCalled()
  })

  it('delete action calls deleteUser and refreshes list', async () => {
    vi.spyOn(userApi, 'getUsers').mockResolvedValue({ users: mockUsers, total: 2, page: 1, limit: 10 })
    const deleteUserMock = vi.spyOn(userApi, 'deleteUser').mockResolvedValue({})
    const wrapper = mountPage()
    await flushPromises()
    // Simulate delete event from UserTable stub
    await wrapper.findComponent({ name: 'UserTable' }).vm.$emit('delete', 1)
    await flushPromises()
    expect(deleteUserMock).toHaveBeenCalledWith(1)
    expect(userApi.getUsers).toHaveBeenCalledTimes(2) // initial + after delete
  })
}) 