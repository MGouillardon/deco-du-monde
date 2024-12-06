<script setup>
import ErrorLayout from '@/layouts/ErrorLayout.vue'
</script>

<template>
  <ErrorLayout
    title="Page not found"
    description="Sorry, the page you are looking for doesn't exist or has been moved."
    :error-code="404"
  >
    <template #actions>
      <a href="/" class="btn btn-primary btn-sm">Back to home</a>
      <button class="btn btn-outline btn-sm" onclick="history.back()">Go back</button>
    </template>
  </ErrorLayout>
</template>
