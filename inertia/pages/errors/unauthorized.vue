<script setup>
import ErrorLayout from '@/layouts/ErrorLayout.vue'
</script>

<template>
  <ErrorLayout
    title="Unauthorized access"
    description="You need to be authenticated to access this page."
    :error-code="401"
  >
    <template #actions>
      <a href="/login" class="btn btn-primary btn-sm">Sign in</a>
      <button class="btn btn-sm" onclick="history.back()">Go back</button>
    </template>
  </ErrorLayout>
</template>
