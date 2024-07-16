<script setup>
import { Link } from '@inertiajs/vue3'
import { computed } from 'vue'
import UserIcon from '@/components/icons/UserIcon.vue'
import LogoutIcon from '@/components/icons/LogoutIcon.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import BurgerMenuIcon from '@/components/icons/BurgerMenuIcon.vue'

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
  <header
    class="navbar bg-base-100 border-b-2 border-b-base-200 px-4 md:px-6 lg:px-8 fixed top-0 left-0 right-0 z-50"
  >
    <div
      class="absolute left-0 top-0 bottom-0 w-80 border-r-2 border-r-base-200 hidden lg:block"
    ></div>
    <div class="flex-1 z-10">
      <a class="btn btn-ghost text-xl hidden lg:flex">Déco du monde</a>
      <label for="my-drawer-2" class="drawer-button lg:hidden">
        <BurgerMenuIcon />
      </label>
    </div>
    <div class="flex-none gap-4">
      <div class="form-control">
        <label class="input input-bordered input-sm flex items-center gap-2">
          <SearchIcon />
          <input type="text" class="grow" placeholder="Search" />
        </label>
      </div>
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
