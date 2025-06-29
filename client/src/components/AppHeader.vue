<template>
  <el-header class="app-header">
    <div class="app-header__content">
      <span class="app-header__title">User Manager</span>
      <router-link to="/users" class="app-header__nav-link">Users</router-link>
    </div>
  </el-header>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.app-header {
  background: $primary-color;
  color: #fff;
  box-shadow: 0 2px 8px #f0f1f2;
  padding: 0 24px;
  &__content {
    display: flex;
    align-items: center;
    height: 100%;
  }
  &__title {
    font-size: 1.3rem;
    font-weight: bold;
    margin-right: 2rem;
  }
  &__nav-link {
    color: #fff;
    text-decoration: none;
    font-size: 1rem;
    &:hover {
      text-decoration: underline;
    }
    &.router-link-exact-active {
      text-decoration: underline;
    }
  }
}
</style> 