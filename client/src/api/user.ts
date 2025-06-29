import axios from 'axios'

export interface User {
  id: number
  name: string
  email: string
  age: number
}

export interface GetUsersResponse {
  users: User[]
  total: number
  page: number
  limit: number
}

export async function getUsers(params: { page?: number; limit?: number; search?: string } = {}): Promise<GetUsersResponse> {
  const { page = 1, limit = 10, search = '' } = params
  const response = await axios.get('/users', {
    params: { page, limit, search },
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  })
  return response.data
}

export async function getUser(id: number): Promise<{ name: string; email: string; age: number }> {
  const response = await axios.get(`/users/${id}`, {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  })
  const { name, email, age } = response.data
  return { name, email, age }
}

export async function createUser(data: { name: string; email: string; age: number }) {
  const response = await axios.post('/users', data, {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  })
  return response.data
}

export async function updateUser(id: number, data: { name: string; email: string; age: number }) {
  const response = await axios.put(`/users/${id}`, data, {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  })
  return response.data
}

export async function deleteUser(id: number) {
  const response = await axios.delete(`/users/${id}`, {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  })
  return response.data
} 