<template>
  <el-form :model="form" :rules="rules" ref="formRef" label-width="80px" class="user-form" @submit.prevent="onSubmit">
    <el-form-item label="Name" prop="name">
      <el-input v-model="form.name" autocomplete="off" class="user-form__input" />
    </el-form-item>
    <el-form-item label="Email" prop="email">
      <el-input v-model="form.email" autocomplete="off" class="user-form__input" />
    </el-form-item>
    <el-form-item label="Age" prop="age">
      <el-input-number v-model="form.age" :min="18" :max="200" class="user-form__input-number" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Submit</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  user?: { name: string; email: string; age: number }
}>()
const emit = defineEmits(['submit'])

const form = ref({
  name: props.user?.name || '',
  email: props.user?.email || '',
  age: props.user?.age || 18,
})

const rules = {
  name: [
    { required: true, message: 'Name is required', trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Email must be valid', trigger: 'blur' },
  ],
  age: [
    { required: true, message: 'Age is required', trigger: 'blur' },
    { validator: (_: any, value: number, callback: any) => {
      if (value < 18) callback(new Error('Age must be greater than 18'))
      else callback()
    }, trigger: 'blur' },
  ],
}

const formRef = ref()

function onSubmit() {
  (formRef.value as any).validate((valid: boolean) => {
    if (valid) {
      emit('submit', { ...form.value })
    }
  })
}

watch(() => props.user, (newUser) => {
  if (newUser) {
    form.value = { ...newUser }
  }
})
</script>

<style lang="scss" scoped>
.user-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 24px;
  background: #fff;
  border-radius: $border-radius;
  box-shadow: 0 2px 8px #f0f1f2;
  &__input {
    width: 100%;
  }
  &__input-number {
    width: 100%;
  }
}
</style> 