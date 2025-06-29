import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserTable from '../UserTable.vue'

const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 30 },
]

describe('UserTable.vue', () => {
  it('renders user data', () => {
    const wrapper = mount(UserTable, {
      props: { users, total: 2, page: 1, limit: 10 },
    })
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('Bob')
    expect(wrapper.text()).toContain('alice@example.com')
    expect(wrapper.text()).toContain('bob@example.com')
  })

  it('emits edit event when edit button is clicked', async () => {
    const wrapper = mount(UserTable, {
      props: { users, total: 2, page: 1, limit: 10 },
    })
    const editBtn = wrapper.findAll('button').find(btn => btn.text() === '')
    expect(editBtn).toBeDefined()
    if (editBtn) await editBtn.trigger('click') // first edit button
    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')![0][0]).toBe(1)
  })

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(UserTable, {
      props: { users, total: 2, page: 1, limit: 10 },
    })
    const buttons = wrapper.findAll('button')
    // Find the delete button for the first row (should be the second button in the row)
    await buttons[1].trigger('click')
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')![0][0]).toBe(1)
  })

  it('emits page-change and limit-change events from pagination', async () => {
    const wrapper = mount(UserTable, {
      props: { users, total: 2, page: 1, limit: 10 },
    })
    // Simulate pagination events
    await wrapper.findComponent({ name: 'ElPagination' }).vm.$emit('current-change', 2)
    await wrapper.findComponent({ name: 'ElPagination' }).vm.$emit('size-change', 5)
    expect(wrapper.emitted('page-change')).toBeTruthy()
    expect(wrapper.emitted('page-change')![0][0]).toBe(2)
    expect(wrapper.emitted('limit-change')).toBeTruthy()
    expect(wrapper.emitted('limit-change')![0][0]).toBe(5)
  })
}) 