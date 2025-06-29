<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <el-container style="min-height: 100vh;">
    <el-header>
      <AppHeader />
    </el-header>
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>

<style scoped>
</style>
