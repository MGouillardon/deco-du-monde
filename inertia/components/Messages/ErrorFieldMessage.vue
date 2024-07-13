<script setup>
const props = defineProps({
  error: Object,
})
</script>

<template>
  <p class="text-error text-xs m-0">
    {{ error.join(', ') }}
  </p>
</template>
