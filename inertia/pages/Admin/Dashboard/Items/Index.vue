<script setup>
import { ref, computed } from 'vue'
import { Link } from '@inertiajs/vue3'
import Pagination from '@/components/UI/Pagination.vue'
import Modal from '@/components/UI/Modal.vue'

const props = defineProps({
  items: Object,
})

const showDeleteModal = ref(false)
const itemToDelete = ref(null)

const startIndex = computed(() => (props.items.meta.currentPage - 1) * props.items.meta.perPage + 1)


function openDeleteModal(item) {
  itemToDelete.value = item
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  itemToDelete.value = null
}

function confirmDelete() {
  closeDeleteModal()
}

const itemsNeedingStudioPhoto = computed(() =>
  props.items.data.filter((item) => !item.isPhotographedStudio)
)

const itemsNeedingValidation = computed(() =>
  props.items.data.filter((item) => item.isPhotographedStudio && item.validations.length === 0)
)

const itemsNeedingInSituPhoto = computed(() =>
  props.items.data.filter((item) => item.sets.length === 0)
)

function scheduleStudioPhoto(item) {}

function validatePhoto(item) {}

function assignToSet(item) {}
</script>

<template>
  <div class="flex justify-between items-center mb-4">
    <Pagination
      :current-page="props.items.meta.currentPage"
      :last-page="props.items.meta.lastPage"
    />
    <Link class="btn btn-primary btn-sm" href="/admin/dashboard/items/create">Create an Item</Link>
  </div>
  <div class="card bg-base-100 shadow-xl mb-8">
    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Studio Photo Taken</th>
            <th>Studio Photo Validated</th>
            <th>In Situ Photo Needed</th>
            <th>Status</th>
            <th>Sets</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in props.items.data" :key="item.id">
            <th>{{ startIndex + index }}</th>
            <td>{{ item.name }}</td>
            <td>
              <span
                :class="item.isPhotographedStudio ? 'badge badge-success' : 'badge badge-error'"
              >
                {{ item.isPhotographedStudio ? 'Yes' : 'No' }}
              </span>
            </td>
            <td>
              <span
                :class="item.validations.length > 0 ? 'badge badge-success' : 'badge badge-error'"
              >
                {{ item.validations.length > 0 ? 'Yes' : 'No' }}
              </span>
            </td>
            <td>
              <span :class="item.sets.length === 0 ? 'badge badge-info' : 'badge badge-ghost'">
                {{ item.sets.length === 0 ? 'Yes' : 'No' }}
              </span>
            </td>
            <td>
              <span
                :class="{
                  'badge badge-info': item.itemStatus.status === 'normal',
                  'badge badge-warning': item.itemStatus.status === 'damaged',
                  'badge badge-error': item.itemStatus.status === 'lost',
                }"
              >
                {{ item.itemStatus.status }}
              </span>
            </td>
            <td>{{ item.sets.length }}</td>
            <td class="flex gap-2">
              <Link class="btn btn-sm btn-secondary" :href="`/admin/dashboard/items/show/${item.id}`">View</Link>
              <Link class="btn btn-sm" :href="`/admin/dashboard/items/edit/${item.id}`"
                >Update</Link
              >
              <button class="btn btn-sm btn-error" @click="openDeleteModal(item)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Items Needing Studio Photo</h2>
        <ul>
          <li
            v-for="item in itemsNeedingStudioPhoto"
            :key="item.id"
            class="flex justify-between items-center mb-2"
          >
            <span>{{ item.name }}</span>
            <button @click="scheduleStudioPhoto(item)" class="btn btn-sm btn-primary">
              Schedule
            </button>
          </li>
        </ul>
      </div>
    </div>

    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Items Needing Validation</h2>
        <ul>
          <li
            v-for="item in itemsNeedingValidation"
            :key="item.id"
            class="flex justify-between items-center mb-2"
          >
            <span>{{ item.name }}</span>
            <button @click="validatePhoto(item)" class="btn btn-sm btn-secondary">Validate</button>
          </li>
        </ul>
      </div>
    </div>

    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Items Needing In Situ Photo</h2>
        <ul>
          <li
            v-for="item in itemsNeedingInSituPhoto"
            :key="item.id"
            class="flex justify-between items-center mb-2"
          >
            <span>{{ item.name }}</span>
            <button @click="assignToSet(item)" class="btn btn-sm btn-accent">Assign to Set</button>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <Modal :is-open="showDeleteModal" @close="closeDeleteModal">
    <template #header>
      <h3 class="font-bold text-lg">Confirm Deletion</h3>
    </template>
    <p class="py-4">
      Are you sure you want to delete the item "{{ itemToDelete?.name }}"? This action cannot be
      undone.
    </p>
    <template #footer>
      <button class="btn btn-sm" @click="closeDeleteModal">Cancel</button>
      <button class="btn btn-error btn-sm" @click="confirmDelete">Delete</button>
    </template>
  </Modal>
</template>
