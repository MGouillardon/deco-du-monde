<script setup>
import { computed } from 'vue'
import ListingTable from '@/components/ListingTable.vue'

const props = defineProps({
  sets: {
    type: Object,
    required: true,
  },
})

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'isPhotographed', label: 'Photographed' },
  { key: 'itemsCount', label: 'Items' },
]

const actions = [
  {
    label: 'View',
    link: (set) => `/admin/dashboard/sets/show/${set.id}`,
    class: 'btn-secondary',
  },
  {
    label: 'Edit',
    link: (set) => `/admin/dashboard/sets/edit/${set.id}`,
    class: 'btn-primary',
  },
  {
    label: 'Delete',
    event: 'delete',
    class: 'btn-error',
  },
]

const formatSet = (set) => ({
  ...set,
  isPhotographed: {
    value: set.isPhotographed ? 'Yes' : 'No',
    class: set.isPhotographed ? 'badge badge-success' : 'badge badge-error',
  },
  itemsCount: set.items.length,
})

const formattedSets = computed(() => ({
  ...props.sets,
  data: props.sets.data.map(formatSet),
}))
</script>

<template>
  <ListingTable
    :items="formattedSets"
    :columns="columns"
    :actions="actions"
    create-link="/admin/dashboard/sets/create"
    create-label="Create a Set"
    delete-route="/admin/dashboard/sets/delete"
  />
</template>