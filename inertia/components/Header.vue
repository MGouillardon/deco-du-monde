<script setup>
import { Link } from '@inertiajs/vue3'
import { computed } from 'vue'
import UserIcon from '../components/icons/UserIcon.vue'
import LogoutIcon from '../components/icons/LogoutIcon.vue'

const props = defineProps({
  user: String,
})

const userInitial = computed(() => {
  return props.user
    .split(' ')
    .map((name) => name.charAt(0))
    .join('')
    .toUpperCase()
})
</script>

<template>
  <header class="navbar bg-base-200 px-4 md:px-6 lg:px-8">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl">Déco du monde</a>
    </div>
    <div class="flex-none gap-2">
      <div class="form-control">
        <input
          type="text"
          placeholder="Search"
          class="input input-bordered input-sm w-24 md:w-auto"
        />
      </div>
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-primary btn-circle">
          <div class="w-8 h-8 rounded-full flex items-center justify-center">
            <span>{{ userInitial }}</span>
          </div>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
        >
          <li>
            <a><UserIcon />Profile</a>
          </li>
          <li>
            <Link href="/admin/logout" method="delete" as="button" type="button"
              ><LogoutIcon />Logout</Link
            >
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>
