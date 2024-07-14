<script setup>
import { Link } from '@inertiajs/vue3'
import HomeIcon from '@/components/icons/HomeIcon.vue'
import CalendarIcon from '@/components/icons/CalendarIcon.vue'
import CameraIcon from '@/components/icons/CameraIcon.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import DataIcon from '@/components/icons/DataIcon.vue'
</script>

<template>
  <aside class="drawer-side">
    <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
    <div
      class="menu bg-base-100 border-r-2 border-r-bg-base-200 text-base-content min-h-full w-80 p-0"
    >
      <header class="navbar bg-base-100 border-b-2 border-b-base-200 pb-[2px] px-4 md:px-6 lg:px-8">
        <a class="btn btn-ghost text-xl">daisyUI</a>
      </header>
      <ul class="menu bg-base-100 p-4 md:p-6 lg:p-8 gap-4">
        <li>
          <Link href="/admin/dashboard" :class="{ active: $page.url === '/admin/dashboard' }">
            <HomeIcon />Dashboard
          </Link>
        </li>
        <li>
          <a><CalendarIcon />Calendar</a>
        </li>
        <li>
          <details open>
            <summary><CameraIcon />Work</summary>
            <ul>
              <li><a>Sets</a></li>
              <li><a>Items</a></li>
            </ul>
          </details>
        </li>
        <li>
          <details>
            <summary><DataIcon />Reports</summary>
            <ul>
              <li><a>History</a></li>
              <li><a>Analysis</a></li>
            </ul>
          </details>
        </li>
        <li>
          <details>
            <summary><SettingsIcon />Settings</summary>
            <ul>
              <li><a>Profile</a></li>
              <li><a>Logout</a></li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
  </aside>
</template>
