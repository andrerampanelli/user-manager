import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import UserDetailsPage from '../UserDetailsPage.vue'
import * as userApi from '@/api/user'
import ElementPlus from 'element-plus'
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { createRouter, createMemoryHistory } from 'vue-router'

vi.mock('@/api/user')

const user = { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 }

function makeRouter(initialPath = '/users/1') {
  const routes = [
    { path: '/users/:id', name: 'UserDetails', component: UserDetailsPage, props: true },
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
})

describe('UserDetailsPage.vue', () => {
  it('fetches and displays user details', async () => {
    vi.spyOn(userApi, 'getUser').mockResolvedValue({ name: user.name, email: user.email, age: user.age })
    const router = await makeRouter('/users/1')
    const wrapper = mount(UserDetailsPage, {
      global: {
        plugins: [ElementPlus, router],
        components: { ArrowLeftBold },
      },
    })
    await flushPromises()
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('alice@example.com')
    expect(wrapper.text()).toContain('25')
    expect(userApi.getUser).toHaveBeenCalledWith(1)
  })

  it('shows error if getUser fails', async () => {
    vi.spyOn(userApi, 'getUser').mockRejectedValue({ response: { data: { error: 'fail' } } })
    const router = await makeRouter('/users/1')
    const wrapper = mount(UserDetailsPage, {
      global: {
        plugins: [ElementPlus, router],
        components: { ArrowLeftBold },
      },
    })
    await flushPromises()
    expect(wrapper.text()).toContain('fail')
  })
}) 