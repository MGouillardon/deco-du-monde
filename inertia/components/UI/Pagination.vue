<script setup>
import { Link } from '@inertiajs/vue3'
import { computed } from 'vue'

const props = defineProps({ currentPage: Number, lastPage: Number })

const pages = computed(() => {
  const range = []
  for (let i = 1; i <= props.lastPage; i++) {
    range.push(i)
  }
  return range
})
</script>

<template>
  <div class="join">
    <Link
      v-for="page in pages"
      :key="page"
      :href="`?page=${page}`"
      :class="['join-item btn btn-sm', page === currentPage ? 'bg-neutral text-white' : 'bg-base-100']"
    >
      {{ page }}
    </Link>
  </div>
</template>
