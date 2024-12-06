<script setup>
import ErrorLayout from '@/layouts/ErrorLayout.vue'

defineProps({
  errorCode: {
    type: Number,
    default: 500
  }
})
</script>

<template>
  <ErrorLayout
    title="Server error"
    description="We're experiencing some technical difficulties. Please try again later."
    :error-code="errorCode"
  >
    <template #actions>
      <a href="/" class="btn btn-primary btn-sm">Back to home</a>
      <button class="btn btn-sm" onclick="history.back()">Go back</button>
      <button class="btn btn-sm" onclick="location.reload()">Try again</button>
    </template>
  </ErrorLayout>
</template>