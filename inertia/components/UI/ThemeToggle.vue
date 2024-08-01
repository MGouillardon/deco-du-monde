<script setup>
import SunIcon from '@/components/icons/SunIcon.vue'
import MoonIcon from '@/components/icons/MoonIcon.vue'
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <label class="flex cursor-pointer gap-2">
    <SunIcon />
    <input
      type="checkbox"
      :checked="theme === 'dracula'"
      @change="toggleTheme"
      class="toggle theme-controller"
    />
    <MoonIcon />
  </label>
</template>
