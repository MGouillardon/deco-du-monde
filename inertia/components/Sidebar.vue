<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import HomeIcon from '@/components/icons/HomeIcon.vue'
import UsersIcon from '@/components/icons/UsersIcon.vue'
import CalendarIcon from '@/components/icons/CalendarIcon.vue'
import CameraIcon from '@/components/icons/CameraIcon.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import DataIcon from '@/components/icons/DataIcon.vue'

const auth = usePage().props.auth
const can = auth?.user?.can ?? {
  viewDashboard: false,
  viewUsers: false,
  viewWork: false,
  viewReports: false,
}
const userId = auth?.user?.id
</script>

<template>
  <aside class="drawer-side">
    <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
    <div class="menu bg-base-100 text-base-content min-h-full w-80 p-0">
      <ul class="menu bg-base-100 p-4 mt-16 md:p-6 lg:p-8 gap-4">
        <li v-if="can.viewDashboard">
          <Link href="/admin/dashboard" :class="{ active: $page.url === '/admin/dashboard' }">
            <HomeIcon />Dashboard
          </Link>
        </li>

        <li v-if="can.viewUsers">
          <Link
            href="/admin/dashboard/users/listing"
            :class="{ active: $page.url.startsWith('/admin/dashboard/users') }"
          >
            <UsersIcon />Users
          </Link>
        </li>

        <li>
          <Link
            href="/admin/dashboard/events/index"
            :class="{ active: $page.url.startsWith('/admin/dashboard/events') }"
          >
            <CalendarIcon />Calendar
          </Link>
        </li>

        <li v-if="can.viewWork">
          <details>
            <summary><CameraIcon />Work</summary>
            <ul>
              <li>
                <Link
                  href="/admin/dashboard/items/listing"
                  :class="{ active: $page.url.startsWith('/admin/dashboard/items') }"
                >
                  Items
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/dashboard/sets/listing"
                  :class="{ active: $page.url.startsWith('/admin/dashboard/sets') }"
                >
                  Sets
                </Link>
              </li>
            </ul>
          </details>
        </li>

        <li v-if="can.viewReports">
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
              <li v-if="userId">
                <Link
                  :href="`/admin/dashboard/profile/${userId}`"
                  :class="{ active: $page.url.startsWith('/admin/dashboard/profile') }"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/admin/logout" method="delete" as="button"> Logout </Link>
              </li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
  </aside>
</template>
