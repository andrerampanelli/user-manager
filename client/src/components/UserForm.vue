<template>
  <el-form @submit.prevent="onSubmit" class="user-form">
    <el-form-item label="Name" :error="nameError">
      <el-input v-model="name" autocomplete="off" class="user-form__input" />
    </el-form-item>
    <el-form-item label="Email" :error="emailError">
      <el-input v-model="email" autocomplete="off" class="user-form__input" />
    </el-form-item>
    <el-form-item label="Age" :error="ageError">
      <el-input-number v-model="age" :min="18" :max="200" class="user-form__input-number" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Submit</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { required, email as emailRule } from '@vee-validate/rules'
import { defineProps, defineEmits, watch } from 'vue'

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

<style lang="scss" scoped>
.user-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 24px;
  background: #fff;
  box-shadow: 0 2px 8px #f0f1f2;
  &__input {
    width: 100%;
  }
  &__input-number {
    width: 100%;
  }
}
</style> 