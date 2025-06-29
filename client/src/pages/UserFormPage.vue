<template>
  <el-card class="w-full max-w-md mx-auto mt-12 p-6 bg-white shadow-md">
    <div class="flex items-center gap-4 mb-4">
      <el-button circle @click="router.back()">
        <el-icon><ArrowLeftBold /></el-icon>
      </el-button>
      <h1 class="text-2xl font-bold text-center">{{ isEdit ? 'Edit User' : 'Add User' }}</h1>
    </div>
    <UserForm :user="user" @submit="onSubmit" />
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import UserForm from '@/components/UserForm.vue'
import { getUser, createUser, updateUser } from '@/api/user'

const route = useRoute()
const router = useRouter()
const isEdit = !!route.params.id
const user = ref<{ name: string; email: string; age: number } | undefined>(undefined)

onMounted(async () => {
  if (isEdit) {
    const res = await getUser(Number(route.params.id))
    console.log(res)
    user.value = res
  }
})

async function onSubmit(formData: { name: string; email: string; age: number }) {
  try {
    if (isEdit) {
      await updateUser(Number(route.params.id), formData)
      ElMessage.success('User updated')
    } else {
      await createUser(formData)
      ElMessage.success('User created')
    }
    router.push({ name: 'UserList' })
  } catch (err: any) {
    ElMessage.error(err?.response?.data?.error || 'Operation failed')
  }
}
</script>
