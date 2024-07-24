<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close'])

const modalRef = ref(null)

watch(
  () => props.isOpen,
  (newVal) => {
    newVal ? modalRef.value?.showModal() : modalRef.value?.close()
  }
)

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <dialog ref="modalRef" class="modal modal-bottom sm:modal-middle" @close="handleClose">
    <div class="modal-box">
      <slot name="header"></slot>
      <slot></slot>
      <div class="modal-action">
        <slot name="footer"></slot>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
/* :root:has(:is(.modal-open, .modal:target, .modal-toggle:checked + .modal, .modal[open])) {
  overflow: hiden !important;
  scrollbar-gutter: auto !important;
} */
</style>
