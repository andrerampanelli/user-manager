<template>
  <div>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="id" label="ID" width="40" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="age" label="Age" width="60" />
      <el-table-column label="Actions" width="120">
        <template #default="{ row }">
          <el-button size="small" @click="$emit('edit', row.id)">
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button size="small" type="danger" @click="$emit('delete', row.id)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
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
import { defineProps, defineEmits } from 'vue'
import type { User } from '@/api/user'
import { Edit, Delete } from '@element-plus/icons-vue'

defineProps<{
  users: User[]
  total: number
  page: number
  limit: number
}>()

defineEmits(['edit', 'delete', 'page-change', 'limit-change'])
</script> 