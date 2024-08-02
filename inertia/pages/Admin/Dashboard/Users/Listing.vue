<script setup>
import ListingTable from '@/components/ListingTable.vue'

const props = defineProps({
  users: {
    type: Object,
    required: true,
  },
})

const columns = [
  { key: 'fullName', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'roleName', label: 'Role' },
]

const actions = [
  {
    label: 'Edit',
    link: (user) => `/admin/dashboard/users/edit/${user.id}`,
    class: 'btn-secondary',
  },
  {
    label: 'Delete',
    event: 'delete',
    class: 'btn-error',
  },
]
</script>

<template>
  <ListingTable
    :items="users"
    :columns="columns"
    :actions="actions"
    create-link="/admin/dashboard/users/create"
    create-label="Create a User"
    delete-route="/admin/dashboard/users/delete"
    item-name-field="fullName"
  />
</template>
