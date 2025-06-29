<template>
  <div>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="age" label="Age" width="80" />
      <!-- Add actions column later -->
    </el-table>
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      layout="prev, pager, next, sizes, total"
      :page-sizes="[5, 10, 20, 50]"
      @current-change="$emit('page-change', $event)"
      @size-change="$emit('limit-change', $event)"
      style="margin-top: 16px; text-align: right;"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { User } from '@/api/user'

defineProps<{
  users: User[]
  total: number
  page: number
  limit: number
}>()
</script> 