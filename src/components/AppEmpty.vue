<template>
  <div class="app-empty">
    <div class="app-empty__icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="13 2 13 9 20 9" />
      </svg>
    </div>
    <p class="app-empty__title">{{ title || 'No data' }}</p>
    <p v-if="description" class="app-empty__desc">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  /** Title text for the empty state */
  title?: string
  /** Description text below the title */
  description?: string
}>()
</script>

<style scoped>
.app-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  text-align: center;
}

.app-empty__icon {
  color: var(--color-text-placeholder);
  margin-bottom: var(--spacing-md);
}

.app-empty__title {
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.app-empty__desc {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-placeholder);
}
</style>
