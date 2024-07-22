<script setup>
import { computed } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'

const page = usePage()
const currentRoute = computed(() => page.url)

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const createBreadcrumbItem = (name, path, current = false) => {
  return {
    name: capitalizeFirstLetter(name),
    path,
    current,
  }
}

const isLastPartNumeric = (parts, index) => {
  return index === parts.length - 1 && !isNaN(parts[index])
}

const breadcrumbs = computed(() => {
  const parts = currentRoute.value.split('/').filter(Boolean)
  const items = [createBreadcrumbItem('Dashboard', '/admin/dashboard')]
  let currentPath = ''

  for (let i = 2; i < parts.length; i++) {
    if (isLastPartNumeric(parts, i)) continue

    const part = parts[i].split('?')[0]
    currentPath += `/${part}`

    items.push(
      createBreadcrumbItem(
        part,
        i === parts.length - 1 ? currentPath : `/admin/dashboard/${part}`,
        i === parts.length - 1
      )
    )
  }

  return items
})
</script>

<template>
  <div v-if="breadcrumbs.length > 1" class="breadcrumbs text-sm">
    <ul>
      <li v-for="crumb in breadcrumbs" :key="crumb.path">
        <Link v-if="!crumb.current" :href="crumb.path">{{ crumb.name }}</Link>
        <span v-else>{{ crumb.name }}</span>
      </li>
    </ul>
  </div>
</template>
