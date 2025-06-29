<template>
  <el-header height="60px"  class="app-header">
    <div class="header-content">
      <span class="app-title">User Manager</span>
      <router-link to="/users" class="nav-link">Users</router-link>
    </div>
  </el-header>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-header {
  background: #409eff;
  color: #fff;
  box-shadow: 0 2px 8px #f0f1f2;
  padding: 0 24px;
}
.header-content {
  display: flex;
  align-items: center;
  height: 100%;
}
.app-title {
  font-size: 1.3rem;
  font-weight: bold;
  margin-right: 2rem;
}
.nav-link {
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
}
.nav-link.router-link-exact-active {
  text-decoration: underline;
}
</style> 