import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import UserDetailsPage from '../UserDetailsPage.vue'
import * as userApi from '@/api/user'

vi.mock('@/api/user')

const user = { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 }

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetAllMocks()
})

describe('UserDetailsPage.vue', () => {
  it('fetches and displays user details', async () => {
    vi.spyOn(userApi, 'getUser').mockResolvedValue({ name: user.name, email: user.email, age: user.age })
    const wrapper = mount(UserDetailsPage, {
      global: { mocks: { $route: { params: { id: 1 } }, $router: { back: vi.fn() } } },
    })
    await flushPromises()
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('alice@example.com')
    expect(wrapper.text()).toContain('25')
    expect(userApi.getUser).toHaveBeenCalledWith(1)
  })

  it('shows error if getUser fails', async () => {
    vi.spyOn(userApi, 'getUser').mockRejectedValue({ response: { data: { error: 'fail' } } })
    const wrapper = mount(UserDetailsPage, {
      global: { mocks: { $route: { params: { id: 1 } }, $router: { back: vi.fn() } } },
    })
    await flushPromises()
    expect(wrapper.text()).toContain('fail')
  })
}) 