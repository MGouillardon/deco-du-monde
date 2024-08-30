<script setup>
import { Link } from '@inertiajs/vue3'
import { formatWidgetDate } from '@/utils/formatters'
import Card from '@/components/UI/Card.vue'

defineProps({
  upcomingEvent: Array,
})
</script>

<template>
  <Card title="Upcoming Event">
    <ul>
      <li v-for="event in upcomingEvent" :key="event.id" class="mb-4">
        <div class="font-semibold">{{ formatWidgetDate(event.startTime) }}</div>
        <div>{{ event.set ? `Shoot: ${event.set.name}` : 'Preparation' }}</div>
        <div class="text-sm text-base-content/70">Location: {{ event.location.name }}</div>
      </li>
    </ul>
    <div class="card-actions justify-end">
      <Link href="/admin/dashboard/events/index" class="btn btn-primary btn-sm">
        View Full Event
      </Link>
    </div>
  </Card>
</template>