<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'info',
  },
  show: {
    type: Boolean,
    default: false,
  },
})

const alertClass = computed(() => {
  return props.type === 'success' ? 'alert-success' : 'alert-info'
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
