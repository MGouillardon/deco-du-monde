<script setup>
import Header from '@/components/Header.vue'
import AsideLayout from '@/layouts/AsideLayout.vue'
import FlashMessage from '@/components/Messages/FlashMessage.vue'
import PageTitle from '@/components/PageTitle.vue'
import Breadcrumb from '@/components/UI/Breadcrumb.vue'
import { usePage, Head } from '@inertiajs/vue3'
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})

const page = usePage()
const flashMessages = computed(() => ({
  success: page.props.success,
  info: page.props.info
}))
const user = computed(() => page.props.auth)

const pageTitle = computed(() => `${props.title} | Admin`)
</script>

<template>
  <Head :title="pageTitle" />
  <Header v-if="user" :user="user" />
  <AsideLayout>
    <main class="mx-auto h-full w-full mt-16 p-4 md:p-6 lg:p-8 max-w-7xl">
      <Breadcrumb />
      <PageTitle v-if="title" :title="title" />
      <slot></slot>
    </main>
    <FlashMessage v-if="flashMessages.success" type="success" :message="flashMessages.success" />
    <FlashMessage v-if="flashMessages.info" type="info" :message="flashMessages.info" />
  </AsideLayout>
</template>