<template>
  <DefaultLayout navbar-title="OnePlatform">
    <template #sidebar>
      <div class="home-page__sidebar-placeholder">
        <p class="home-page__sidebar-text">Navigation menu</p>
        <p class="home-page__sidebar-hint">Add your menu items here</p>
      </div>
    </template>

    <div class="home-page">
      <h2 class="home-page__welcome">Welcome to OnePlatform</h2>
      <p class="home-page__description">
        This is your home page skeleton. Start building your application by adding components and pages.
      </p>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>

<style scoped>
.home-page__sidebar-placeholder {
  padding: var(--spacing-md);
}

.home-page__sidebar-text {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text);
}

.home-page__sidebar-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-placeholder);
  margin-top: var(--spacing-xs);
}

.home-page {
  text-align: center;
  padding: var(--spacing-2xl);
}

.home-page__welcome {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
}

.home-page__description {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  max-width: 500px;
  margin: 0 auto;
}
</style>
