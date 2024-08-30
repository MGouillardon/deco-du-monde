<script setup>
import { Link } from '@inertiajs/vue3'
import { ref } from 'vue'
import { formatWidgetTitle, formatWidgetDate } from '@/utils/formatters'

const props = defineProps({
  title: String,
  stats: Object,
  recentActivity: Object,
  upcomingEvent: Array,
  statusOverview: Object,
})

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
        <div class="stat-title">{{ formatWidgetTitle(key) }}</div>
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
            <span class="text-sm text-base-content/70"> - {{ formatWidgetDate(item.updatedAt) }}</span>
          </li>
        </ul>
        <div class="divider">Recent Sets</div>
        <ul>
          <li v-for="set in recentActivity.sets" :key="set.id" class="mb-2">
            <Link :href="`/admin/dashboard/sets/show/${set.id}`" class="link link-hover">
              {{ set.name }}
            </Link>
            <span class="text-sm text-base-content/70"> - {{ formatWidgetDate(set.createdAt) }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Upcoming Event -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Upcoming Event</h2>
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
          <Link href="/admin/dashboard/events/create" class="btn btn-primary btn-sm">
            Event Shoot
          </Link>
        </div>
      </div>
    </div>
  </div>
</template>
