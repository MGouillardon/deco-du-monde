<script setup>
import { computed } from 'vue'

const props = defineProps({
  error: {
    type: [String, Array],
    required: true,
  },
})

const errorMessage = computed(() => {
  if (typeof props.error === 'string') {
    return props.error
  }
  return Array.isArray(props.error) ? props.error.join(', ') : ''
})
</script>

<template>
  <p class="text-error text-xs m-0">
    {{ errorMessage }}
  </p>
</template>
