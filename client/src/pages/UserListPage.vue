<template>
  <div>
    <h1>Users</h1>
    <el-input v-model="search" placeholder="Search by name or email" style="width: 300px; margin-bottom: 16px;" @input="onSearch" clearable />
    <UserTable
      :users="users"
      :total="total"
      :page="page"
      :limit="limit"
      @page-change="onPageChange"
      @limit-change="onLimitChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import UserTable from '@/components/UserTable.vue'
import { getUsers, type User } from '@/api/user'

const users = ref<User[]>([])
const total = ref(0)
const page = ref(1)
const limit = ref(10)
const search = ref('')

async function fetchUsers() {
  const res = await getUsers({ page: page.value, limit: limit.value, search: search.value })
  users.value = res.users
  total.value = res.total
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
</script> 