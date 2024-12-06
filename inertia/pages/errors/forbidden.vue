<script setup>
import ErrorLayout from '@/layouts/ErrorLayout.vue'
</script>

<template>
  <ErrorLayout
    title="Access forbidden"
    description="You don't have permission to access this resource."
    :error-code="403"
  >
    <template #actions>
      <a href="/" class="btn btn-primary btn-sm">Back to home</a>
      <button class="btn btn-sm" onclick="history.back()">Go back</button>
    </template>
  </ErrorLayout>
</template>