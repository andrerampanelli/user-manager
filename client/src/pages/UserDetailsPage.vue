<template>
  <div>
    <el-card v-if="user" class="w-full max-w-md mx-auto mt-12 p-6 bg-white shadow-md">
      <div class="flex items-center gap-4 mb-4">
        <el-button circle @click="router.back()">
          <el-icon><ArrowLeftBold /></el-icon>
        </el-button>
        <h1 class="text-2xl font-bold text-center">User Details</h1>
      </div>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">{{ user.id }}</el-descriptions-item>
        <el-descriptions-item label="Name">{{ user.name }}</el-descriptions-item>
        <el-descriptions-item label="Email">{{ user.email }}</el-descriptions-item>
        <el-descriptions-item label="Age">{{ user.age }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-skeleton v-else-if="loading" rows="4" animated />
    <el-alert v-else-if="error" :title="error" type="error" show-icon />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUser, type User } from '@/api/user'

const route = useRoute()
const router = useRouter()
const user = ref<User | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await getUser(Number(route.params.id))
    user.value = { id: Number(route.params.id), ...res }
  } catch (err: any) {
    error.value = err?.response?.data?.error || 'Failed to fetch user details'
  } finally {
    loading.value = false
  }
})
</script>
