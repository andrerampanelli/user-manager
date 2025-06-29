import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import UserListPage from '../UserListPage.vue'
import * as userApi from '@/api/user'

vi.mock('@/api/user')

const mockUsers = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 30 },
]

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetAllMocks()
})

describe('UserListPage.vue', () => {
  it('fetches and displays users', async () => {
    vi.spyOn(userApi, 'getUsers').mockResolvedValue({ users: mockUsers, total: 2, page: 1, limit: 10 })
    const wrapper = mount(UserListPage)
    await flushPromises()
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('Bob')
    expect(userApi.getUsers).toHaveBeenCalled()
  })

  it('search input triggers getUsers', async () => {
    const getUsersMock = vi.spyOn(userApi, 'getUsers').mockResolvedValue({ users: mockUsers, total: 2, page: 1, limit: 10 })
    const wrapper = mount(UserListPage)
    await flushPromises()
    const input = wrapper.find('input[placeholder="Search by name or email"]')
    await input.setValue('Alice')
    await input.trigger('input')
    await flushPromises()
    expect(getUsersMock).toHaveBeenCalled()
  })

  it('delete action calls deleteUser and refreshes list', async () => {
    vi.spyOn(userApi, 'getUsers').mockResolvedValue({ users: mockUsers, total: 2, page: 1, limit: 10 })
    const deleteUserMock = vi.spyOn(userApi, 'deleteUser').mockResolvedValue({})
    const wrapper = mount(UserListPage)
    await flushPromises()
    // Simulate delete event from UserTable
    await wrapper.findComponent({ name: 'UserTable' }).vm.$emit('delete', 1)
    await flushPromises()
    expect(deleteUserMock).toHaveBeenCalledWith(1)
    expect(userApi.getUsers).toHaveBeenCalledTimes(2) // initial + after delete
  })
}) 