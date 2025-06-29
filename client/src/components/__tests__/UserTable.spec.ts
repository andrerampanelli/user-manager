import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserTable from '../UserTable.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 30 },
]

describe('UserTable.vue', () => {
  function mountTable(props = {}) {
    return mount(UserTable, {
      props: { users, total: 2, page: 1, limit: 10, ...props },
      global: {
        plugins: [ElementPlus],
        stubs: {
          'router-link': true,
          'el-icon': true,
          'el-table': true,
          'el-table-column': true,
        },
      },
    })
  }

  it('passes correct props to el-table', () => {
    const wrapper = mountTable()
    const table = wrapper.findComponent({ name: 'ElTable' })
    expect(table.exists()).toBe(true)
    expect(wrapper.props('users')).toEqual(users)
    expect(wrapper.props('total')).toBe(2)
    expect(wrapper.props('page')).toBe(1)
    expect(wrapper.props('limit')).toBe(10)
  })

  it('emits edit event when edit handler is called', async () => {
    const wrapper = mountTable()
    await wrapper.vm.$emit('edit', 1)
    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')![0][0]).toBe(1)
  })

  it('emits delete event when delete handler is called', async () => {
    const wrapper = mountTable()
    await wrapper.vm.$emit('delete', 1)
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')![0][0]).toBe(1)
  })

  it('emits page-change and limit-change events from pagination', async () => {
    const wrapper = mountTable()
    await wrapper.findComponent({ name: 'ElPagination' }).vm.$emit('current-change', 2)
    await wrapper.findComponent({ name: 'ElPagination' }).vm.$emit('size-change', 5)
    expect(wrapper.emitted('page-change')).toBeTruthy()
    expect(wrapper.emitted('page-change')![0][0]).toBe(2)
    expect(wrapper.emitted('limit-change')).toBeTruthy()
    expect(wrapper.emitted('limit-change')![0][0]).toBe(5)
  })
}) 