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
})

const getAlertClass = computed(() => {
  return props.type === 'success' ? 'alert-success' : 'alert-info'
})
</script>

<template>
  <div class="toast toast-bottom toast-end">
    <div :class="['alert', getAlertClass]" role="alert">
      <span>{{ message }}</span>
    </div>
  </div>
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
