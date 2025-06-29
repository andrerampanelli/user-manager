<template>
  <el-form @submit.prevent="onSubmit" class="grid grid-cols-1 gap-4">
    <el-form-item label="Name" :error="nameError">
      <el-input v-model="name" autocomplete="off" />
    </el-form-item>
    <el-form-item label="Email" :error="emailError">
      <el-input v-model="email" autocomplete="off" />
    </el-form-item>
    <el-form-item label="Age" :error="ageError">
      <el-input-number v-model="age" :min="18" :max="200" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Submit</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { required, email as emailRule } from '@vee-validate/rules'
import { watch } from 'vue'

const props = defineProps<{
  user?: { name: string; email: string; age: number }
}>()
const emit = defineEmits(['submit'])

const { handleSubmit, setValues } = useForm({
  initialValues: {
    name: props.user?.name || '',
    email: props.user?.email || '',
    age: props.user?.age || 18,
  }
})

const { value: name, errorMessage: nameError } = useField('name', required)
const { value: email, errorMessage: emailError } = useField('email', value => {
  if (!required(value)) return 'Email is required'
  if (!emailRule(value)) return 'Email must be valid'
  return true
})
const { value: age, errorMessage: ageError } = useField('age', value => {
  if (!required(value)) return 'Age is required'
  if (Number(value) < 18) return 'Age must be greater than 18'
  return true
})

watch(() => props.user, (newUser) => {
  if (newUser) {
    setValues({ ...newUser })
  }
})

const onSubmit = handleSubmit(values => {
  emit('submit', values)
})
</script>
