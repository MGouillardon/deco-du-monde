<script setup>
const users = defineProps({
  users: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div>
    {{ users }}
  </div>
</template>
