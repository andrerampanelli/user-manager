import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import * as userApi from './user'

vi.mock('axios')
const mockedAxios = axios as unknown as { get: any; post: any; put: any; delete: any }

beforeEach(() => {
  vi.clearAllMocks()
})

describe('user API', () => {
  it('getUsers calls axios.get with correct params and returns data', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: { users: [], total: 0, page: 1, limit: 10 } })
    const res = await userApi.getUsers({ page: 1, limit: 10, search: 'foo' })
    expect(mockedAxios.get).toHaveBeenCalledWith('/users', expect.objectContaining({ params: { page: 1, limit: 10, search: 'foo' } }))
    expect(res).toEqual({ users: [], total: 0, page: 1, limit: 10 })
  })

  it('getUser calls axios.get with correct id and returns user', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: { name: 'A', email: 'a@a.com', age: 20 } })
    const res = await userApi.getUser(5)
    expect(mockedAxios.get).toHaveBeenCalledWith('/users/5', expect.any(Object))
    expect(res).toEqual({ name: 'A', email: 'a@a.com', age: 20 })
  })

  it('createUser calls axios.post and returns data', async () => {
    mockedAxios.post = vi.fn().mockResolvedValue({ data: { id: 1, name: 'B', email: 'b@b.com', age: 22 } })
    const res = await userApi.createUser({ name: 'B', email: 'b@b.com', age: 22 })
    expect(mockedAxios.post).toHaveBeenCalledWith('/users', { name: 'B', email: 'b@b.com', age: 22 }, expect.any(Object))
    expect(res).toEqual({ id: 1, name: 'B', email: 'b@b.com', age: 22 })
  })

  it('updateUser calls axios.put and returns data', async () => {
    mockedAxios.put = vi.fn().mockResolvedValue({ data: { id: 2, name: 'C', email: 'c@c.com', age: 30 } })
    const res = await userApi.updateUser(2, { name: 'C', email: 'c@c.com', age: 30 })
    expect(mockedAxios.put).toHaveBeenCalledWith('/users/2', { name: 'C', email: 'c@c.com', age: 30 }, expect.any(Object))
    expect(res).toEqual({ id: 2, name: 'C', email: 'c@c.com', age: 30 })
  })

  it('deleteUser calls axios.delete and returns data', async () => {
    mockedAxios.delete = vi.fn().mockResolvedValue({ data: { message: 'deleted' } })
    const res = await userApi.deleteUser(3)
    expect(mockedAxios.delete).toHaveBeenCalledWith('/users/3', expect.any(Object))
    expect(res).toEqual({ message: 'deleted' })
  })
}) 