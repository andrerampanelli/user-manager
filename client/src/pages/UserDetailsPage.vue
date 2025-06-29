<template>
  <div class="user-details-page">
    <el-card v-if="user" class="user-details-page__card">
      <h2 class="user-details-page__title">User Details</h2>
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
import { useRoute } from 'vue-router'
import { getUser, type User } from '@/api/user'

const route = useRoute()
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

<style lang="scss" scoped>
.user-details-page {
  max-width: 500px;
  margin: 32px auto;
  &__card {
    padding: 24px;
    border-radius: $border-radius;
    box-shadow: 0 2px 8px #f0f1f2;
    background: #fff;
  }
  &__title {
    margin-bottom: 24px;
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
  }
}
</style> 