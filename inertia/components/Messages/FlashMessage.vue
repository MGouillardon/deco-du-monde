<script setup>
defineProps({
  flash: String,
})
</script>

<template>
  <div v-if="flash" class="toast toast-bottom toast-end">
    <div role="alert" class="alert alert-success">
      <span>{{ flash }}</span>
    </div>
  </div>
</template>
