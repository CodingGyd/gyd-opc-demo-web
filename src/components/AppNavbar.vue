<template>
  <header class="app-navbar">
    <div class="app-navbar__left">
      <button v-if="showMenu" class="app-navbar__menu-btn" @click="$emit('toggleSidebar')">
        <span class="app-navbar__menu-icon">&#9776;</span>
      </button>
      <h1 class="app-navbar__title">{{ title }}</h1>
    </div>

    <div class="app-navbar__right">
      <slot name="actions" />
      <div v-if="userStore.isLoggedIn" class="app-navbar__user">
        <span class="app-navbar__user-name">{{ userStore.userInfo?.name || 'User' }}</span>
        <button class="app-navbar__logout-btn" @click="handleLogout">Logout</button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'

defineProps<{
  /** Application title displayed in the navbar */
  title?: string
  /** Whether to show the sidebar toggle button */
  showMenu?: boolean
}>()

defineEmits<{
  toggleSidebar: []
}>()

const userStore = useUserStore()

async function handleLogout() {
  await userStore.logout()
}
</script>

<style scoped>
.app-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--navbar-height);
  padding: 0 var(--spacing-md);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-navbar__left {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.app-navbar__menu-btn {
  background: none;
  border: none;
  font-size: 20px;
  padding: var(--spacing-xs);
  color: var(--color-text-secondary);
}

.app-navbar__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.app-navbar__right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.app-navbar__user {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.app-navbar__user-name {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.app-navbar__logout-btn {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.app-navbar__logout-btn:hover {
  color: var(--color-error);
  border-color: var(--color-error);
}
</style>
