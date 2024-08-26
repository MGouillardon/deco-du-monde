<script setup>
import { computed } from 'vue'
import { useFlashMessage } from '@/composables/useFlashMessage'
const { message, type, show, clearFlashMessage } = useFlashMessage()

const alertClass = computed(() => {
  return type.value === 'success' ? 'alert-success' : 'alert-info'
})
</script>

<template>
  <transition name="slide">
    <div v-if="show" class="toast toast-bottom toast-end z-50">
      <div :class="['alert', alertClass]" role="alert">
        <span>{{ message }}</span>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.toast {
  animation:
    slide-up 0.5s forwards,
    slide-down 0.8s 5s forwards;
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
