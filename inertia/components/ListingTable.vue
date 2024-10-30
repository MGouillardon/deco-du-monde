<script setup>
import { computed } from 'vue'
import { Link } from '@inertiajs/vue3'
import Pagination from '@/components/UI/Pagination.vue'
import Table from '@/components/UI/Table.vue'
import Modal from '@/components/UI/Modal.vue'
import { useDeleteModal } from '@/composables/useDeleteModal'

const props = defineProps({
  items: {
    type: Object,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  actions: {
    type: Array,
    required: true,
  },
  createLink: {
    type: String,
    required: true,
  },
  createLabel: {
    type: String,
    required: true,
  },
  deleteRoute: {
    type: String,
    required: true,
  },
  itemNameField: {
    type: String,
    default: 'name',
  },
})

const hasCreateLink = computed(() => !!props.createLink)

const { showDeleteModal, itemToDelete, openDeleteModal, closeDeleteModal, confirmDelete } =
  useDeleteModal(props.deleteRoute)

const startIndex = computed(() => {
  const { currentPage, perPage = 10 } = props.items.meta
  return (currentPage - 1) * perPage + 1
})

const itemDisplayName = computed(() => {
  if (!itemToDelete.value) return 'this item'
  return itemToDelete.value[props.itemNameField] || 'this item'
})
</script>

<template>
  <div class="flex justify-between items-center mb-4">
    <Pagination :current-page="items.meta.currentPage" :last-page="items.meta.lastPage" />
    <Link v-if="hasCreateLink" class="btn btn-primary btn-sm" :href="createLink">{{ createLabel }}</Link>
  </div>
  <Table
    :items="items.data"
    :columns="columns"
    :actions="actions"
    :start-index="startIndex"
    @delete="openDeleteModal"
  />

  <Modal :is-open="showDeleteModal" @close="closeDeleteModal">
    <template #header>
      <h3 class="font-bold text-lg">Confirm Deletion</h3>
    </template>
    <p class="py-4">
      Are you sure you want to delete {{ itemDisplayName }}? This action cannot be undone.
    </p>
    <template #footer>
      <button class="btn btn-sm" @click="closeDeleteModal">Cancel</button>
      <button class="btn btn-error btn-sm" @click="confirmDelete">Delete</button>
    </template>
  </Modal>
</template>
