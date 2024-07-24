<script setup>
import { ref, computed } from 'vue'
import { Link, useForm } from '@inertiajs/vue3'
import Pagination from '@/components/UI/Pagination.vue'
import Modal from '@/components/UI/Modal.vue'

const props = defineProps({
  users: {
    type: Object,
    required: true,
  },
})

const startIndex = computed(() => {
  const { currentPage, perPage = 10 } = props.users.meta
  return (currentPage - 1) * perPage + 1
})

const showDeleteModal = ref(false)
const userToDelete = ref(null)

const deleteForm = useForm({})

const openDeleteModal = (user) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  userToDelete.value = null
}

const confirmDelete = () => {
  deleteForm.delete(`/admin/dashboard/users/delete/${userToDelete.value.id}`, {
    preserveScroll: true,
    preserveState: true,
    onSuccess: () => {
      closeDeleteModal()
    },
  })
}
</script>

<template>
  <div class="flex justify-between items-center mb-4">
    <Pagination
      :current-page="props.users.meta.currentPage"
      :last-page="props.users.meta.lastPage"
    />
    <Link class="btn btn-primary btn-sm" href="/admin/dashboard/users/create">Create a User</Link>
  </div>
  <div class="card bg-base-100 shadow-xl">
    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in props.users.data" :key="user.id">
            <th>{{ startIndex + index }}</th>
            <td>{{ user.fullName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.roleName }}</td>
            <td class="flex gap-2">
              <Link class="btn btn-sm" :href="`/admin/dashboard/users/edit/${user.id}`"
                >Update</Link
              >
              <button class="btn btn-sm btn-error" @click="openDeleteModal(user)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <Modal :is-open="showDeleteModal" @close="closeDeleteModal">
    <template #header>
      <h3 class="font-bold text-lg">Confirm Deletion</h3>
    </template>
    <p class="py-4">
      Are you sure you want to delete {{ userToDelete?.fullName }}? This action cannot be undone.
    </p>
    <template #footer>
      <button class="btn btn-sm" @click="closeDeleteModal">Cancel</button>
      <button class="btn btn-error btn-sm" @click="confirmDelete">Delete</button>
    </template>
  </Modal>
</template>
