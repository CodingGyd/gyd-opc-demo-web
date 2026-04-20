<template>
  <div class="app-loading" :class="{ 'app-loading--fullscreen': fullscreen }">
    <div class="app-loading__spinner"></div>
    <p v-if="text" class="app-loading__text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  /** Loading text to display below the spinner */
  text?: string
  /** Whether to display as a fullscreen overlay */
  fullscreen?: boolean
}>()
</script>

<style scoped>
.app-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
}

.app-loading--fullscreen {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}

.app-loading__spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.app-loading__text {
  margin-top: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
