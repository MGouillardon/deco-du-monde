<script setup>
import Sidebar from '@/components/Sidebar.vue'
</script>

<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <slot></slot>
    </div>
    <Sidebar />
  </div>
</template>
