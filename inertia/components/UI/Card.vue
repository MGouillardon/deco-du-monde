<script setup>
defineProps({
  title: String,
})
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">{{ title }}</h2>
      <slot></slot>
    </div>
  </div>
</template>