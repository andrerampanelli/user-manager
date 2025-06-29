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
