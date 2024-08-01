<script setup>
import SearchIcon from '@/components/icons/SearchIcon.vue'
</script>

<template>
  <div class="form-control">
    <label class="input input-bordered input-sm flex items-center gap-2">
      <SearchIcon />
      <input type="text" class="grow" placeholder="Search" />
    </label>
  </div>
</template>
