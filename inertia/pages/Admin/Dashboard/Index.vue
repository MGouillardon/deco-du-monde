<script setup>
import Statistic from '@/components/Widgets/Statistic.vue'
import RecentActivity from '@/components/Widgets/RecentActivity.vue'
import UpcomingEvent from '@/components/Widgets/UpcomingEvent.vue'
import StatusOverview from '@/components/Widgets/StatusOverview.vue'
import QuickAccess from '@/components/Widgets/QuickAccess.vue'

defineProps({
  title: String,
  stats: Object,
  recentActivity: Object,
  upcomingEvents: Array,
  statusOverview: Object,
})
</script>

<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Statistic v-for="(value, key) in stats" :key="key" :title="key" :value="value" />
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RecentActivity :recent-activity="recentActivity" />
      <UpcomingEvent :upcoming-events="upcomingEvents" />
      <StatusOverview :status-overview="statusOverview" />
      <QuickAccess />
    </div>
  </div>
</template>
