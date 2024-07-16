<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <h1 class="text-2xl font-bold sm:text-3xl mb-8">{{ title }}</h1>
</template>
