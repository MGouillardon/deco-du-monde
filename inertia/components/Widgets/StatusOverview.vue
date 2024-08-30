<script setup>
import { getStatusColor } from '@/utils/dashboard'
import Card from '@/components/UI/Card.vue'

defineProps({
  statusOverview: Object,
})
</script>

<template>
  <Card title="Status Overview">
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
  </Card>
</template>