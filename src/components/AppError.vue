<template>
  <div class="app-error">
    <div class="app-error__icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <p class="app-error__title">{{ title || 'Something went wrong' }}</p>
    <p v-if="message" class="app-error__message">{{ message }}</p>
    <button v-if="showRetry" class="app-error__retry-btn" @click="$emit('retry')">
      Retry
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  /** Error title */
  title?: string
  /** Detailed error message */
  message?: string
  /** Whether to show the retry button */
  showRetry?: boolean
}>()

defineEmits<{
  /** Emitted when the user clicks the retry button */
  retry: []
}>()
</script>

<style scoped>
.app-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  text-align: center;
}

.app-error__icon {
  color: var(--color-error);
  margin-bottom: var(--spacing-md);
}

.app-error__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text);
}

.app-error__message {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  max-width: 400px;
}

.app-error__retry-btn {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.app-error__retry-btn:hover {
  background: var(--color-primary-dark);
}
</style>
