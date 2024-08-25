<script setup>
import { useForm } from '@inertiajs/vue3'
import ErrorFieldMessage from '@/components/Messages/ErrorFieldMessage.vue'
import { ref, computed } from 'vue'

const props = defineProps({
  title: String,
  locations: Array,
  sets: Array,
  users: Array,
  eventTypes: Object,
  errors: Object,
})

const form = useForm({
  locationId: '',
  startTime: '',
  endTime: '',
  type: '',
  setId: null,
  userIds: [],
})

const selectedUsers = ref([])

const availableUsers = computed(() => {
  return props.users.filter((user) => !selectedUsers.value.includes(user.id))
})

const addUser = (userId) => {
  userId = parseInt(userId, 10)
  if (userId && !selectedUsers.value.includes(userId)) {
    selectedUsers.value.push(userId)
    form.userIds = selectedUsers.value
  }
}

const selectRef = ref(null)

const handleUserSelection = () => {
  const selectedValue = selectRef.value.value
  addUser(selectedValue)
  selectRef.value.value = ''
}

const removeUser = (userId) => {
  selectedUsers.value = selectedUsers.value.filter((id) => id !== userId)
  form.userIds = selectedUsers.value
}

const showSetSelection = computed(() => {
  return form.type === props.eventTypes.SET_SHOOT || form.type === props.eventTypes.SET_REMOVAL
})

const handleTypeChange = () => {
  if (!showSetSelection.value) {
    form.setId = null
  }
}

const formatEventType = (type) => {
  return type
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ')
}

const submit = () => {
  form.post('/admin/dashboard/events/store')
}
</script>

<template>
  <div class="card mx-auto bg-base-100 shadow-xl">
    <form @submit.prevent="submit" class="card-body">
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
        <label for="startTime" class="label">
          <span class="label-text">Start Time</span>
        </label>
        <input
          type="datetime-local"
          id="startTime"
          v-model="form.startTime"
          class="input input-bordered"
          required
        />
        <ErrorFieldMessage v-if="errors?.startTime" :error="errors.startTime" class="mt-1" />
      </div>

      <div class="form-control">
        <label for="endTime" class="label">
          <span class="label-text">End Time</span>
        </label>
        <input
          type="datetime-local"
          id="endTime"
          v-model="form.endTime"
          class="input input-bordered"
          required
        />
        <ErrorFieldMessage v-if="errors?.endTime" :error="errors.endTime" class="mt-1" />
      </div>

      <div class="form-control">
        <label for="type" class="label">
          <span class="label-text">Event Type</span>
        </label>
        <select
          id="type"
          v-model="form.type"
          class="select select-bordered"
          @change="handleTypeChange"
          required
        >
          <option value="">Select a type</option>
          <option v-for="type in Object.values(props.eventTypes)" :key="type" :value="type">
            {{ formatEventType(type) }}
          </option>
        </select>
        <ErrorFieldMessage v-if="errors?.type" :error="errors.type" class="mt-1" />
      </div>

      <div v-if="showSetSelection" class="form-control">
        <label for="set" class="label">
          <span class="label-text">Set</span>
        </label>
        <select id="set" v-model="form.setId" class="select select-bordered">
          <option value="">Select a set</option>
          <option v-for="set in sets" :key="set.id" :value="set.id">
            {{ set.name }}
          </option>
        </select>
        <ErrorFieldMessage v-if="errors?.setId" :error="errors.setId" class="mt-1" />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Assigned Users</span>
        </label>
        <div class="flex flex-wrap gap-2 mb-2">
          <div v-for="userId in selectedUsers" :key="userId" class="badge badge-primary badge-lg">
            {{ props.users.find((u) => u.id === userId)?.fullName || 'Unknown User' }}
            <button type="button" @click="removeUser(userId)" class="ml-2" aria-label="Remove user">
              &times;
            </button>
          </div>
        </div>
        <select
          ref="selectRef"
          @change="handleUserSelection"
          class="select select-bordered mt-2"
          aria-label="Add a user"
        >
          <option value="">Add a user</option>
          <option v-for="user in availableUsers" :key="user.id" :value="user.id">
            {{ user.fullName }}
          </option>
        </select>
        <ErrorFieldMessage v-if="errors?.userIds" :error="errors.userIds" class="mt-1" />
      </div>

      <div class="form-control mt-6">
        <button type="submit" class="btn btn-primary" :disabled="form.processing">
          {{ form.processing ? 'Creating...' : 'Create Event' }}
        </button>
      </div>
    </form>
  </div>
</template>
