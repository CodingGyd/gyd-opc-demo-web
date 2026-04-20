<template>
  <div class="default-layout">
    <aside v-if="sidebarVisible" class="default-layout__sidebar">
      <div class="default-layout__sidebar-header">
        <h2 class="default-layout__logo">OnePlatform</h2>
      </div>
      <nav class="default-layout__nav">
        <slot name="sidebar" />
      </nav>
    </aside>

    <div class="default-layout__main">
      <AppNavbar
        :title="navbarTitle"
        :showMenu="true"
        @toggle-sidebar="toggleSidebar"
      />

      <main class="default-layout__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppNavbar from '@/components/AppNavbar.vue'

defineProps<{
  /** Title displayed in the navbar */
  navbarTitle?: string
}>()

const sidebarVisible = ref(true)

function toggleSidebar() {
  sidebarVisible.value = !sidebarVisible.value
}
</script>

<style scoped>
.default-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.default-layout__sidebar {
  width: var(--sidebar-width);
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.default-layout__sidebar-header {
  height: var(--navbar-height);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.default-layout__logo {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-primary);
}

.default-layout__nav {
  flex: 1;
  padding: var(--spacing-sm);
  overflow-y: auto;
}

.default-layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.default-layout__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
}
</style>
