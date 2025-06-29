<template>
  <div>
    <h1>{{ isEdit ? 'Edit User' : 'Add User' }}</h1>
    <UserForm :user="user" @submit="onSubmit" />
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