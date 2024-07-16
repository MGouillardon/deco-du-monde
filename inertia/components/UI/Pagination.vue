<script setup>
import { Link } from '@inertiajs/vue3'
import { computed } from 'vue'

const props = defineProps({ currentPage: Number, lastPage: Number })

const pages = computed(() => {
  return Array.from({ length: props.lastPage }, (_, i) => i + 1)
})
</script>

<template>
  <div class="join">
    <Link
      v-for="page in pages"
      :key="page"
      :href="`?page=${page}`"
      :class="[
        'join-item btn btn-sm',
        page === currentPage ? 'bg-neutral text-white pointer-events-none' : 'bg-base-100',
      ]"
    >
      {{ page }}
    </Link>
  </div>
</template>
