<template>
  <div class="user-form-page">
    <el-card class="user-form-page__card">
      <h1 class="user-form-page__title">{{ isEdit ? 'Edit User' : 'Add User' }}</h1>
      <UserForm :user="user" @submit="onSubmit" />
    </el-card>
  </div>
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

<style lang="scss" scoped>
.user-form-page {
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