<script setup>
import Header from '../components/Header.vue'
import FlashMessage from '../components/Messages/FlashMessage.vue'
import { usePage } from '@inertiajs/vue3'
import { computed } from 'vue'

const page = usePage()
const flash = computed(() => page.props?.success)
const user = computed(() => page.props.auth?.fullName)
</script>

<template>
  <Header v-if="user" :user="user" />
  <slot></slot>
  <FlashMessage v-if="flash" :flash="flash" :key="flash" />
</template>

<style scoped>
.toast {
  animation:
    slide-up 0.5s forwards,
    slide-down 0.8s 2s forwards;
}

@keyframes slide-up {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-down {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
}
</style>
