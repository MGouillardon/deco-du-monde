<script setup>
import { Link } from '@inertiajs/vue3'
import BurgerMenuIcon from '@/components/icons/BurgerMenuIcon.vue'
import ThemeToggle from '@/components/UI/ThemeToggle.vue'
import UserDropdown from '@/components/UserDropdown.vue'
import SearchBar from '@/components/UI/SearchBar.vue'

const props = defineProps({
  user: Object,
})
</script>

<template>
  <header
    class="navbar bg-base-100 border-b-2 border-b-base-200 px-4 md:px-6 lg:px-8 fixed top-0 left-0 right-0 z-50"
  >
    <div
      class="absolute left-0 top-0 bottom-0 w-[322px] border-r-2 border-r-base-200 hidden lg:block"
    ></div>
    <div class="flex-1 z-10">
      <a class="btn btn-ghost text-xl hidden lg:flex">Déco du monde</a>
      <label for="my-drawer-2" class="drawer-button lg:hidden">
        <BurgerMenuIcon />
      </label>
    </div>
    <div class="flex-none gap-4">
      <SearchBar />
      <ThemeToggle />
      <UserDropdown :user="user" />
    </div>
  </header>
</template>
