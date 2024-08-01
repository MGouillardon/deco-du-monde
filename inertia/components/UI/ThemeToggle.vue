<script setup>
import SunIcon from '@/components/icons/SunIcon.vue'
import MoonIcon from '@/components/icons/MoonIcon.vue'
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button @click="toggleTheme" class="btn btn-ghost btn-circle">
    <SunIcon v-if="theme === 'cupcake'" />
    <MoonIcon v-else />
  </button>
</template>
