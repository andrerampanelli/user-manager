<template>
  <div>
    <h1>Users</h1>
    <el-input v-model="search" placeholder="Search by name or email" style="width: 300px; margin-bottom: 16px;" @input="onSearch" clearable />
    <el-alert v-if="error" :title="error" type="error" show-icon style="margin-bottom: 16px;" />
    <el-skeleton v-if="loading" rows="5" animated />
    <UserTable
      v-else
      :users="users"
      :total="total"
      :page="page"
      :limit="limit"
      @page-change="onPageChange"
      @limit-change="onLimitChange"
      @edit="onEdit"
      @delete="onDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import UserTable from '@/components/UserTable.vue'
import { getUsers, deleteUser, type User } from '@/api/user'

const users = ref<User[]>([])
const total = ref(0)
const page = ref(1)
const limit = ref(10)
const search = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()

async function fetchUsers() {
  loading.value = true
  error.value = ''
  try {
    const res = await getUsers({ page: page.value, limit: limit.value, search: search.value })
    users.value = res.users
    total.value = res.total
  } catch (err: any) {
    error.value = err?.response?.data?.error || 'Failed to fetch users'
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)

function onPageChange(newPage: number) {
  page.value = newPage
  fetchUsers()
}
function onLimitChange(newLimit: number) {
  limit.value = newLimit
  page.value = 1
  fetchUsers()
}
function onSearch() {
  page.value = 1
  fetchUsers()
}

watch([page, limit], fetchUsers)

function onEdit(id: number) {
  router.push({ name: 'UserEdit', params: { id } })
}

async function onDelete(id: number) {
  ElMessageBox.confirm('Are you sure you want to delete this user?', 'Confirm', {
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteUser(id)
      ElMessage.success('User deleted')
      fetchUsers()
    } catch (error) {
      ElMessage.error('Failed to delete user')
    }
  }).catch(() => {
    ElMessage.info('Delete cancelled')
  })
}
</script> 