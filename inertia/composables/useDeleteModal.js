/* eslint-disable unicorn/filename-case */
import { ref } from 'vue'
import { useForm } from '@inertiajs/vue3'

export function useDeleteModal(deleteRoute) {
  const showDeleteModal = ref(false)
  const itemToDelete = ref(null)
  const deleteForm = useForm({})

  const openDeleteModal = (item) => {
    itemToDelete.value = item
    showDeleteModal.value = true
  }

  const closeDeleteModal = () => {
    showDeleteModal.value = false
    itemToDelete.value = null
  }

  const confirmDelete = () => {
    deleteForm.delete(`${deleteRoute}/${itemToDelete.value.id}`, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        closeDeleteModal()
      },
    })
  }

  return {
    showDeleteModal,
    itemToDelete,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  }
}
