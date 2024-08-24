<script setup>
import { computed, watchEffect } from 'vue'
import { usePage, Head } from '@inertiajs/vue3'
import { toRefs } from 'vue'
import Header from '@/components/Header.vue'
import AsideLayout from '@/layouts/AsideLayout.vue'
import FlashMessage from '@/components/Messages/FlashMessage.vue'
import PageTitle from '@/components/PageTitle.vue'
import Breadcrumb from '@/components/UI/Breadcrumb.vue'
import { useFlashMessage } from '@/composables/useFlashMessage'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})

const { title } = toRefs(props)

const page = usePage()
const { flashMessage, showFlash, setFlashMessage } = useFlashMessage()

const user = computed(() => page.props.auth)
const pageTitle = computed(() => `${title.value} | Admin`)

watchEffect(() => {
  const { success, info } = page.props
  if (success || info) {
    setFlashMessage(success ? 'success' : 'info', success || info)
  }
})
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
    <FlashMessage 
      :show="showFlash"
      :type="flashMessage.type" 
      :message="flashMessage.message || ''" 
    />
  </AsideLayout>
</template>