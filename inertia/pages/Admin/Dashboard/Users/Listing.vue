<script setup>
import { Link } from '@inertiajs/vue3'
import Pagination from '@/components/UI/Pagination.vue'
import { computed } from 'vue'

const props = defineProps({
  users: {
    type: Object,
    required: true,
  },
})
const startIndex = computed(() => {
  const currentPage = props.users.meta.currentPage
  const perPage = props.users.meta.perPage || 10 
  return (currentPage - 1) * perPage + 1
})
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
              <Link class="btn btn-sm" :href="`/admin/dashboard/users/edit/${user.id}`">Update</Link>
              <Link class="btn btn-sm btn-error" :href="`/admin/dashboard/users/delete/${user.id}`" method="DELETE" as="button">Delete</Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
