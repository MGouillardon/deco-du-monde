<script setup>
import { Link } from '@inertiajs/vue3'

const props = defineProps({
  set: Object,
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Set Details</h2>
        <p><strong>Name:</strong> {{ set.name }}</p>
        <p><strong>Description:</strong> {{ set.description }}</p>
        <p class="space-x-2">
          <strong>Photographed:</strong>
          <span class="badge" :class="set.isPhotographed ? 'badge-success' : 'badge-error'">
            {{ set.isPhotographed ? 'Yes' : 'No' }}
          </span>
        </p>
        <p><strong>Created:</strong> {{ formatDate(set.createdAt) }}</p>
        <p><strong>Last Updated:</strong> {{ formatDate(set.updatedAt) }}</p>
      </div>
    </div>

    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Associated Items</h2>
        <ul>
          <li v-for="item in set.items" :key="item.id" class="mb-2">
            <Link :href="`/admin/dashboard/items/show/${item.id}`" class="link link-primary">
              {{ item.name }}
            </Link>
          </li>
        </ul>
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
              <tr v-for="validation in set.validations" :key="validation.id">
                <td>{{ validation.type }}</td>
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
  </div>
  <div class="mt-4 space-x-2">
    <Link href="/admin/dashboard/sets" class="btn btn-neutral">Back to List</Link>
    <Link :href="`/admin/dashboard/sets/edit/${set.id}`" class="btn btn-primary">Edit Set</Link>
  </div>
</template>
