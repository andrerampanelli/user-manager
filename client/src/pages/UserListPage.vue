<template>
  <div class="user-list-page">
    <div class="user-list-page__header">
      <el-input v-model="searchInput" placeholder="Search by name or email" class="user-list-page__search" @input="onSearchInput" clearable />
      <el-button type="primary" @click="goToNewUser" icon="Plus" plain>New User</el-button>
    </div>
    <el-alert v-if="error" :title="error" type="error" show-icon class="user-list-page__alert" />
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
import { Plus } from '@element-plus/icons-vue'
import { debounce } from 'lodash'
import UserTable from '@/components/UserTable.vue'
import { getUsers, deleteUser, type User } from '@/api/user'

const users = ref<User[]>([])
const total = ref(0)
const page = ref(1)
const limit = ref(10)
const search = ref('')
const searchInput = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()

function goToNewUser() {
  router.push({ name: 'UserCreate' })
}

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

const debouncedSearch = debounce(() => {
  page.value = 1
  search.value = searchInput.value
  fetchUsers()
}, 400)

function onSearchInput() {
  debouncedSearch()
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

<style lang="scss" scoped>
.user-list-page {
  max-width: 900px;
  margin: 32px auto;
  padding: 24px;
  background: #fff;
  box-shadow: 0 2px 8px #f0f1f2;
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  &__search {
    width: 300px;
  }
  &__alert {
    margin-bottom: 16px;
  }
}
</style> 