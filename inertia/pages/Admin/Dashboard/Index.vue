<script setup>
import { Link } from '@inertiajs/vue3'
import { ref } from 'vue'

const props = defineProps({
  title: String,
  stats: Object,
  recentActivity: Object,
  upcomingSchedule: Array,
  statusOverview: Object,
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const formatTitle = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase()
    .replace(/^./, (char) => char.toUpperCase())
}

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'normal':
      return 'badge-success'
    case 'damaged':
      return 'badge-warning'
    case 'lost':
      return 'badge-error'
    default:
      return 'badge-ghost'
  }
}
</script>

<template>
  <!-- Overview Statistics -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <div v-for="(value, key) in stats" :key="key" class="stats bg-base-100 shadow-xl">
      <div class="stat">
        <div class="stat-title">{{ formatTitle(key) }}</div>
        <p class="stat-value">{{ value }}</p>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Recent Activity -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Recent Activity</h2>
        <div class="divider">Recent Items</div>
        <ul>
          <li v-for="item in recentActivity.items" :key="item.id" class="mb-2">
            <Link :href="`/admin/dashboard/items/show/${item.id}`" class="link link-hover">
              {{ item.name }}
            </Link>
            <span class="text-sm text-base-content/70"> - {{ formatDate(item.updatedAt) }}</span>
          </li>
        </ul>
        <div class="divider">Recent Sets</div>
        <ul>
          <li v-for="set in recentActivity.sets" :key="set.id" class="mb-2">
            <Link :href="`/admin/dashboard/sets/show/${set.id}`" class="link link-hover">
              {{ set.name }}
            </Link>
            <span class="text-sm text-base-content/70"> - {{ formatDate(set.createdAt) }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Upcoming Schedule -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Upcoming Schedule</h2>
        <ul>
          <li v-for="event in upcomingSchedule" :key="event.id" class="mb-4">
            <div class="font-semibold">{{ formatDate(event.startTime) }}</div>
            <div>{{ event.set ? `Shoot: ${event.set.name}` : 'Preparation' }}</div>
            <div class="text-sm text-base-content/70">Location: {{ event.location.name }}</div>
          </li>
        </ul>
        <div class="card-actions justify-end">
          <Link href="/admin/dashboard/schedules/index" class="btn btn-primary btn-sm">
            View Full Schedule
          </Link>
        </div>
      </div>
    </div>

    <!-- Status Overview -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Status Overview</h2>
        <div class="divider">Item Status</div>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="status in statusOverview.itemStatus"
            :key="status.status"
            class="badge"
            :class="getStatusColor(status.status)"
          >
            {{ status.status }}: {{ status.count }}
          </div>
        </div>
        <div class="divider">Set Status</div>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="status in statusOverview.setPhotographed"
            :key="status.status"
            class="badge"
            :class="status.status === 'Photographed' ? 'badge-success' : 'badge-warning'"
          >
            {{ status.status }}: {{ status.count }}
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Access -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Quick Access</h2>
        <div class="flex flex-wrap gap-2">
          <Link href="/admin/dashboard/items/create" class="btn btn-primary btn-sm">
            New Item
          </Link>
          <Link href="/admin/dashboard/sets/create" class="btn btn-primary btn-sm"> New Set </Link>
          <Link href="/admin/dashboard/schedules/create" class="btn btn-primary btn-sm">
            Schedule Shoot
          </Link>
        </div>
      </div>
    </div>
  </div>
</template>
