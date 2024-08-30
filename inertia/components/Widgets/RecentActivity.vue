<script setup>
import { Link } from '@inertiajs/vue3'
import { formatWidgetDate } from '@/utils/formatters'
import Card from '@/components/UI/Card.vue'

defineProps({
  recentActivity: Object,
})
</script>

<template>
  <Card title="Recent Activity">
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
  </Card>
</template>
