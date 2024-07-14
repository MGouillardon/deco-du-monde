<script setup>
import { Link } from '@inertiajs/vue3'

const props = defineProps({
  user: String,
})
</script>

<template>
  <header>
    <div class="navbar bg-base-200">
      <a class="btn btn-ghost text-xl">Déco du monde</a>
    </div>
  </header>
</template>
