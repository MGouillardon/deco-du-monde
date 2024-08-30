<script setup>
import { formatWidgetTitle } from '@/utils/formatters'

defineProps({
  title: String,
  value: [Number, String],
})
</script>

<template>
  <div class="stats bg-base-100 shadow-xl">
    <div class="stat">
      <div class="stat-title">{{ formatWidgetTitle(title) }}</div>
      <p class="stat-value">{{ value }}</p>
    </div>
  </div>
</template>
