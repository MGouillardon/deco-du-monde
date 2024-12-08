<script setup>
import { Link } from '@inertiajs/vue3'
import { formatEventType, formatRole, formatDateTime } from '@/utils/formatters'

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
  can: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <div class="flex justify-end gap-2">
        <Link v-if="props.can.update" :href="`/admin/dashboard/events/edit/${event.id}`" class="btn btn-primary btn-sm"
          >Edit Event</Link
        >
        <Link v-if="props.can.delete"
          :href="`/admin/dashboard/events/delete/${event.id}`"
          method="delete"
          as="button"
          class="btn btn-error btn-sm"
          :data-id="event.id"
          preserve-scroll
        >
          Delete Event
        </Link>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 class="text-xl font-semibold mb-3">Event Details</h3>
          <p class="mb-2">
            <span class="font-medium">Type:</span> {{ formatEventType(event.type) }}
          </p>
          <p class="mb-2"><span class="font-medium">Location:</span> {{ event.location }}</p>
          <p class="mb-2">
            <span class="font-medium">Start:</span> {{ formatDateTime(event.start) }}
          </p>
          <p class="mb-2"><span class="font-medium">End:</span> {{ formatDateTime(event.end) }}</p>
          <p v-if="event.set" class="mb-2">
            <span class="font-medium">Set:</span> {{ event.set.name }}
          </p>
          <p v-if="event.item" class="mb-2">
            <span class="font-medium">Item:</span> {{ event.item.name }}
          </p>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-3">Assigned Users</h3>
          <ul>
            <li v-for="assignment in event.assignments" :key="assignment.id" class="mb-3">
              <p class="font-medium">{{ assignment.user.fullName }}</p>
              <p class="text-sm text-base-content/70">{{ formatRole(assignment.user.role) }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="mt-6">
    <Link href="/admin/dashboard/events" class="btn btn-neutral btn-sm">Back to Calendar</Link>
  </div>
</template>
