<script setup>
import { useForm } from '@inertiajs/vue3'
import { computed, watch, ref } from 'vue'
import { eventConfig } from '@/config/event.js'
import ErrorFieldMessage from '@/components/Messages/ErrorFieldMessage.vue'
import DateTimeInput from '@/components/UI/DateTimeInput.vue'
import SearchableDropdown from '@/components/UI/SearchableDropdown.vue'

const props = defineProps({
  title: String,
  event: Object,
  locations: Array,
  sets: Array,
  items: Array,
  usersByRole: Object,
  eventTypes: Object,
  errors: Object,
})

const initializeAssignments = (type) => {
  const roles = Object.keys(eventConfig[type]?.roles || {})
  return roles.map((role) => ({
    id: null,
    userId: '',
    role: role.toLowerCase(),
  }))
}

const form = useForm({
  locationId: props.event.locationId,
  startTime: props.event.start,
  endTime: props.event.end,
  type: props.event.type,
  setId: props.event.setId,
  itemId: props.event.itemId,
  assignments: props.event.assignments.map((assignment) => ({
    id: assignment.id,
    userId: assignment.userId,
    role: assignment.user.role.toLowerCase(),
  })),
})

const formatEventType = (type) =>
  type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

const showItemSelection = computed(() => eventConfig[form.type]?.needsItem)
const showSetSelection = computed(() => eventConfig[form.type]?.needsSet)
const requiredRoles = computed(() => eventConfig[form.type]?.roles || {})

watch(
  () => form.type,
  (newType) => {
    if (newType !== props.event.type) {
      form.assignments = initializeAssignments(newType)
      form.setId = null
      form.itemId = null
    }
  }
)

watch(
  () => form.startTime,
  (newStartTime) => {
    if (newStartTime) {
      const [startDate, startTime] = newStartTime.split('T')
      const currentEndDate = form.endTime ? form.endTime.split('T')[0] : null

      if (currentEndDate !== startDate) {
        const endTime = form.endTime ? form.endTime.split('T')[1] : '20:00'
        form.endTime = `${startDate}T${endTime}`
      }
    }
  }
)

const getAssignmentForRole = (role) => {
  return form.assignments.find(a => a.role === role.toLowerCase()) || { userId: '' }
}


const isFormValid = computed(() => {
  const requiredFields = ['locationId', 'startTime', 'endTime', 'type']
  if (showSetSelection.value) requiredFields.push('setId')
  if (showItemSelection.value) requiredFields.push('itemId')

  return (
    requiredFields.every((field) => form[field]) &&
    form.assignments.length === Object.keys(requiredRoles.value).length &&
    form.assignments.every((assignment) => assignment.userId) &&
    new Date(form.endTime) > new Date(form.startTime)
  )
})

const submit = () => {
  if (!isFormValid.value) return

  form.put(`/admin/dashboard/events/update/${props.event.id}`, {
    preserveScroll: true,
    preserveState: true,
  })
}
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <form @submit.prevent="submit" class="card-body">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-control">
          <label for="location" class="label">
            <span class="label-text">Location</span>
          </label>
          <select id="location" v-model="form.locationId" class="select select-bordered" required>
            <option value="">Select a location</option>
            <option v-for="location in locations" :key="location.id" :value="location.id">
              {{ location.name }}
            </option>
          </select>
          <ErrorFieldMessage v-if="errors?.locationId" :error="errors.locationId" class="mt-1" />
        </div>

        <div class="form-control">
          <label for="type" class="label">
            <span class="label-text">Event Type</span>
          </label>
          <select id="type" v-model="form.type" class="select select-bordered" required>
            <option value="">Select a type</option>
            <option v-for="(value, key) in eventTypes" :key="key" :value="value">
              {{ formatEventType(key) }}
            </option>
          </select>
          <ErrorFieldMessage v-if="errors?.type" :error="errors.type" class="mt-1" />
        </div>

        <DateTimeInput v-model="form.startTime" label="Start Time" :required="true" />
        <ErrorFieldMessage v-if="errors?.startTime" :error="errors.startTime" class="mt-1" />

        <DateTimeInput
          v-model="form.endTime"
          label="End Time"
          :min="form.startTime"
          :required="true"
          :is-end-time="true"
          :start-time="form.startTime"
        />
        <ErrorFieldMessage v-if="errors?.endTime" :error="errors.endTime" class="mt-1" />
      </div>
      <SearchableDropdown
        v-if="showSetSelection"
        v-model="form.setId"
        :items="sets"
        label="Set"
        placeholder="Search for a set..."
        item-key="id"
        item-label="name"
      />
      <ErrorFieldMessage v-if="errors?.setId" :error="errors.setId" class="mt-1" />

      <SearchableDropdown
        v-if="showItemSelection"
        v-model="form.itemId"
        :items="items"
        label="Item to Shoot"
        placeholder="Search for an item..."
        item-key="id"
        item-label="name"
      />
      <ErrorFieldMessage v-if="errors?.itemId" :error="errors.itemId" class="mt-1" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(count, role) in requiredRoles" :key="role" class="form-control w-full">
          <label :for="`user-${role}`" class="label">
            <span class="label-text">{{ formatEventType(role) }} ({{ count }} required)</span>
          </label>
          <select
            :id="`user-${role}`"
            v-model="getAssignmentForRole(role).userId"
            class="select select-bordered w-full"
            required
          >
            <option value="">Select a {{ formatEventType(role) }}</option>
            <option v-for="user in usersByRole[role.toLowerCase()]" :key="user.id" :value="user.id">
              {{ user.fullName }}
            </option>
          </select>
          <ErrorFieldMessage v-if="errors?.assignments" :error="errors.assignments" class="mt-1" />
        </div>
      </div>
      <div class="form-control mt-6">
        <button type="submit" class="btn btn-primary" :disabled="!isFormValid || form.processing">
          {{ form.processing ? 'Updating...' : 'Update Event' }}
        </button>
      </div>
    </form>
  </div>
</template>
