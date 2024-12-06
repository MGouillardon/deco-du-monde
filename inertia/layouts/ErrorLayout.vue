<script setup>
import { Head } from '@inertiajs/vue3'

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  errorCode: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div class="min-h-screen bg-base-100/50 flex flex-col">
    <Head :title="title" />
    <div class="flex-grow flex items-center justify-center">
      <div class="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div class="text-center">
          <p class="text-9xl font-bold text-primary">{{ errorCode }}</p>
          <h1 class="mt-4 text-3xl font-bold tracking-tight text-base-content sm:text-4xl">{{ title }}</h1>
          <p class="mt-4 text-base text-base-content/70">{{ description }}</p>
          <div class="mt-8 flex gap-4 justify-center">
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>