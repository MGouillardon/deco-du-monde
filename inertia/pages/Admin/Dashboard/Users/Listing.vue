<script setup>
import { Link } from '@inertiajs/vue3'
const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="flex justify-end mb-4">
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
          <tr v-for="(user, index) in props.users" :key="user.id">
            <th>{{ index + 1 }}</th>
            <td>{{ user.fullName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.roleName }}</td>
            <td class="flex gap-2">
              <a class="btn btn-sm" href="#">Update</a>
              <a class="btn btn-sm btn-error" href="#">Delete</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
