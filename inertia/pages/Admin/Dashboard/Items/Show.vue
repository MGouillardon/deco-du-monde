<script setup>
import { Link } from '@inertiajs/vue3'

const props = defineProps({
  title: String,
  item: Object,
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const getStatusBadgeClass = (status) => {
  switch (status.toLowerCase()) {
    case 'normal':
      return 'badge-info'
    case 'damaged':
      return 'badge-warning'
    case 'lost':
      return 'badge-error'
    default:
      return 'badge-ghost'
  }
}

const goBack = () => {
  window.history.back()
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Item Details</h2>
        <p><strong>Name:</strong> {{ item.name }}</p>
        <p><strong>Description:</strong> {{ item.description }}</p>
        <p class="space-x-2">
          <strong>Studio Photo Taken:</strong>
          <span class="badge" :class="item.isPhotographedStudio ? 'badge-success' : 'badge-error'">
            {{ item.isPhotographedStudio ? 'Yes' : 'No' }}
          </span>
        </p>
        <p><strong>Created:</strong> {{ formatDate(item.createdAt) }}</p>
        <p><strong>Last Updated:</strong> {{ formatDate(item.updatedAt) }}</p>
      </div>
    </div>

    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Item Status</h2>
        <p class="space-x-2">
          <strong>Current Status:</strong>
          <span class="badge" :class="getStatusBadgeClass(item.itemStatus.status)">
            {{ capitalizeFirstLetter(item.itemStatus.status) }}
          </span>
        </p>
        <p v-if="item.itemStatus.notes"><strong>Notes:</strong> {{ item.itemStatus.notes }}</p>
      </div>
    </div>

    <div class="card bg-base-100 shadow-xl col-span-full">
      <div class="card-body">
        <h2 class="card-title">Validations</h2>
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Type</th>
                <th>Validated</th>
                <th>Validated At</th>
                <th>Validated By</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="validation in item.validations" :key="validation.id">
                <td>{{ capitalizeFirstLetter(validation.type) }}</td>
                <td>
                  <span
                    class="badge"
                    :class="validation.isValidated ? 'badge-success' : 'badge-error'"
                  >
                    {{ validation.isValidated ? 'Yes' : 'No' }}
                  </span>
                </td>
                <td>
                  {{
                    validation.validatedAt ? formatDate(validation.validatedAt) : 'Not validated'
                  }}
                </td>
                <td>{{ validation.user ? validation.user.fullName : 'N/A' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title flex justify-between items-center">
          Associated Sets
          <span class="badge badge-primary badge-lg">{{ item.sets.length }}</span>
        </h2>
        <div v-if="item.sets.length > 0" class="mt-4">
          <div class="flex flex-wrap gap-2">
            <Link
              v-for="set in item.sets"
              :key="set.id"
              :href="`/admin/dashboard/sets/show/${set.id}`"
              class="btn btn-sm btn-outline gap-2 hover:no-underline"
              :class="set.isPhotographed ? 'btn-success' : 'btn-warning'"
            >
              <span class="truncate max-w-[150px]">{{ set.name }}</span>
              <span v-if="set.isPhotographed" class="tooltip" data-tip="Photographed"> 📸 </span>
              <span v-else class="tooltip" data-tip="Not Photographed"> 📷 </span>
            </Link>
          </div>
        </div>
        <p v-else class="text-sm text-base-content/70 italic">No associated sets found.</p>
        <div class="card-actions justify-end mt-4">
          <Link href="/admin/dashboard/sets" class="btn btn-primary btn-sm"> View All Sets </Link>
        </div>
      </div>
    </div>
  </div>
  <div class="mt-4 space-x-2">
    <button class="btn btn-neutral" @click="goBack">Back to List</button>
    <Link :href="`/admin/dashboard/items/edit/${item.id}`" class="btn btn-primary">Edit Item</Link>
  </div>
</template>
