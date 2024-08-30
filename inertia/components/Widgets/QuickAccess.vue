<script setup>
import { Link } from '@inertiajs/vue3'
import Card from '@/components/UI/Card.vue'
</script>

<template>
  <Card title="Quick Access">
    <div class="flex flex-wrap gap-2">
      <Link href="/admin/dashboard/items/create" class="btn btn-primary btn-sm"> New Item </Link>
      <Link href="/admin/dashboard/sets/create" class="btn btn-primary btn-sm"> New Set </Link>
      <Link href="/admin/dashboard/events/create" class="btn btn-primary btn-sm">
        Event Shoot
      </Link>
    </div>
  </Card>
</template>
