<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import { computed } from 'vue'
import UserIcon from '@/components/icons/UserIcon.vue'
import LogoutIcon from '@/components/icons/LogoutIcon.vue'

const auth = usePage().props.auth

const userInitial = computed(() => {
  if (auth?.user?.fullName) {
    return auth.user.fullName
      .split(' ')
      .map((name) => name.charAt(0))
      .join('')
      .toUpperCase()
  }
  return ''
})

</script>

<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-primary w-8 min-h-8 h-8 rounded-full">
      <div class="flex items-center justify-center">
        <span>{{ userInitial }}</span>
      </div>
    </div>
    <ul
      tabindex="0"
      class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-5 w-52 p-2 shadow"
    >
      <li>
        <Link :href="`/admin/dashboard/profile/${auth.user.id}`"><UserIcon />Profile</Link>
      </li>
      <li>
        <Link href="/admin/logout" method="delete" as="button" type="button"
          ><LogoutIcon />Logout</Link
        >
      </li>
    </ul>
  </div>
</template>
