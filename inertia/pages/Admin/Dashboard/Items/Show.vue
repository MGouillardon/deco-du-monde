<script setup>
import { ref } from 'vue'
import { useForm, usePage } from '@inertiajs/vue3'

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
    default:
      return 'badge-ghost'
  }
}

const goBack = () => {
  window.history.back()
}

const editItem = () => {
  // Implement edit functionality
  console.log('Edit item:', props.item.id)
}
</script><template>
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
          <strong>Status:</strong>
          <span class="badge" :class="getStatusBadgeClass(item.itemStatus.status)">
            {{ capitalizeFirstLetter(item.itemStatus.status) }}
          </span>
        </p>
        <p v-if="item.itemStatus.notes"><strong>Notes:</strong> {{ item.itemStatus.notes }}</p>
        <p><strong>Last Updated:</strong> {{ formatDate(item.itemStatus.updatedAt) }}</p>
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
                <td>{{ formatDate(validation.validatedAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="card bg-base-100 shadow-xl col-span-full">
      <div class="card-body">
        <h2 class="card-title">Associated Sets</h2>
        <p><strong>Sets Count:</strong> {{ item.sets.length }}</p>
        <div v-if="item.sets.length > 0">
          <ul>
            <li v-for="set in item.sets" :key="set.id">{{ set.name }}</li>
          </ul>
        </div>
        <p v-else>No associated sets found.</p>
      </div>
    </div>
  </div>
  <div class="mt-4 space-x-2">
    <button class="btn btn-neutral" @click="goBack">Back to List</button>
    <button class="btn btn-primary" @click="editItem">Edit Item</button>
  </div>
</template>
