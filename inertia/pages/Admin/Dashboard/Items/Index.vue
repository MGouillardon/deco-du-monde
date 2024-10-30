<script setup>
import { ref, computed } from 'vue'
import { Link } from '@inertiajs/vue3'
import ListingTable from '@/components/ListingTable.vue'

const props = defineProps({
  items: {
    type: Object,
    required: true,
  },
  locationType: {
    type: Object,
    required: true,
  },
  can: {
    type: Object,
    required: true,
  },
})

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'isPhotographedStudio', label: 'Studio Photo Taken' },
  { key: 'isValidated', label: 'Studio Photo Validated' },
  { key: 'needsInSituPhoto', label: 'In Situ Photo Needed' },
  { key: 'status', label: 'Status' },
  { key: 'setsCount', label: 'Sets' },
]

const actions = computed(() => {
  const allowedActions = []
  
  allowedActions.push({
    label: 'View',
    link: (item) => `/admin/dashboard/items/show/${item.id}`,
    class: 'btn-secondary',
  })

  if (props.can.update) {
    allowedActions.push({
      label: 'Edit',
      link: (item) => `/admin/dashboard/items/edit/${item.id}`,
      class: 'btn-primary',
    })
  }

  if (props.can.delete) {
    allowedActions.push({
      label: 'Delete',
      event: 'delete',
      class: 'btn-error',
    })
  }

  return allowedActions
})

const BADGE_CLASSES = {
  SUCCESS: 'badge badge-success',
  ERROR: 'badge badge-error',
  INFO: 'badge badge-info',
  GHOST: 'badge badge-ghost',
  WARNING: 'badge badge-warning',
}

const STATUS_CLASSES = {
  normal: BADGE_CLASSES.INFO,
  damaged: BADGE_CLASSES.WARNING,
  lost: BADGE_CLASSES.ERROR,
}

const formatBadge = (condition, trueValue, falseValue) => ({
  value: condition ? trueValue : falseValue,
  class: condition ? BADGE_CLASSES.SUCCESS : BADGE_CLASSES.ERROR,
})

const formatItem = (item) => ({
  ...item,
  isPhotographedStudio: formatBadge(item.isPhotographedStudio, 'Yes', 'No'),
  isValidated: formatBadge(item.validations.length > 0, 'Yes', 'No'),
  needsInSituPhoto: formatBadge(item.sets.length === 0, 'Yes', 'No'),
  setsCount: item.sets.length,
  status: {
    value: item.itemStatus?.status ?? '',
    class: STATUS_CLASSES[item.itemStatus?.status] ?? BADGE_CLASSES.INFO,
  },
})

const formattedItems = computed(() => ({
  ...props.items,
  data: props.items.data.map(formatItem),
}))

const itemsNeedingStudioPhoto = computed(() =>
  props.items.data.filter((item) => !item.isPhotographedStudio)
)

const itemsNeedingValidation = computed(() =>
  props.items.data.filter((item) => {
    const studioValidation = item.validations.find((v) => v.type === props.locationType.STUDIO)
    return item.isPhotographedStudio && (!studioValidation || !studioValidation.isValidated)
  })
)

const itemsNeedingInSituPhoto = computed(() =>
  props.items.data.filter((item) => item.sets.length === 0)
)

const eventStudioPhoto = (item) => {}

const assignToSet = (item) => {}
</script>

<template>
  <ListingTable
    :items="formattedItems"
    :columns="columns"
    :actions="actions"
    :create-link="can.create ? '/admin/dashboard/items/create' : null"
    create-label="Create an Item"
    delete-route="/admin/dashboard/items/delete"
  />

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
    <div v-if="can.update" class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Items Needing Studio Photo</h2>
        <ul>
          <li
            v-for="item in itemsNeedingStudioPhoto"
            :key="item.id"
            class="flex justify-between items-center mb-2"
          >
            <span>{{ item.name }}</span>
            <button @click="eventStudioPhoto(item)" class="btn btn-sm btn-accent">Event</button>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="can.validateStudioPhoto" class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Items Needing Validation</h2>
        <ul>
          <li
            v-for="item in itemsNeedingValidation"
            :key="item.id"
            class="flex justify-between items-center mb-2"
          >
            <span>{{ item.name }}</span>
            <Link
              class="btn btn-sm btn-accent"
              :href="`/admin/dashboard/items/validate/${item.id}`"
              method="POST"
              as="button"
              preserve-scroll
            >
              Validate
            </Link>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="can.update" class="card bg-base-100 shadow-xl">
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
</template>
