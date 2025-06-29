import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/users',
    name: 'UserList',
    component: () => import('@/pages/UserListPage.vue'),
  },
  {
    path: '/users/new',
    name: 'UserCreate',
    component: () => import('@/pages/UserFormPage.vue'),
  },
  {
    path: '/users/:id/edit',
    name: 'UserEdit',
    component: () => import('@/pages/UserFormPage.vue'),
    props: true,
  },
  {
    path: '/',
    redirect: '/users',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
