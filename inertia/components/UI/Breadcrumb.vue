<script setup>
import { computed } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'

const DASHBOARD_PATH = '/admin/dashboard'

const page = usePage()
const currentRoute = computed(() => page.url)

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const createBreadcrumbItem = (name, path, isActive = false) => {
  return {
    name: capitalizeFirstLetter(name),
    path,
    isActive,
  }
}

const isLastPartId = (parts, index) => {
  return index === parts.length - 1 && !isNaN(parts[index])
}

const removeIdFromParts = (parts) => {
  return parts.filter((part, index) => !isLastPartId(parts, index))
}

const generateBreadcrumbs = (urlParts) => {
  return urlParts.reduce(
    (items, part, index) => {
      const cleanPart = part.split('?')[0]
      const currentPath = `${DASHBOARD_PATH}/${urlParts.slice(0, index + 1).join('/')}`

      items.push(
        createBreadcrumbItem(
          cleanPart,
          index === urlParts.length - 1 ? currentPath : `${DASHBOARD_PATH}/${cleanPart}`,
          index === urlParts.length - 1
        )
      )

      return items
    },
    [createBreadcrumbItem('Dashboard', DASHBOARD_PATH)]
  )
}

const breadcrumbs = computed(() => {
  try {
    const urlParts = currentRoute.value.split('/').filter(Boolean).slice(2)
    const partsWithoutId = removeIdFromParts(urlParts)
    return generateBreadcrumbs(partsWithoutId)
  } catch (error) {
    console.error('Error generating breadcrumbs:', error)
    return [createBreadcrumbItem('Dashboard', DASHBOARD_PATH, true)]
  }
})
</script>

<template>
  <div v-if="breadcrumbs.length > 1" class="breadcrumbs text-sm">
    <ul>
      <li v-for="crumb in breadcrumbs" :key="crumb.path">
        <Link v-if="!crumb.isActive" :href="crumb.path">{{ crumb.name }}</Link>
        <span v-else>{{ crumb.name }}</span>
      </li>
    </ul>
  </div>
</template>
