<script setup>
import { ref, computed } from 'vue'
import { useForm, router } from '@inertiajs/vue3'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const VIEW_MONTH = 'dayGridMonth'
const VIEW_WEEK = 'timeGridWeek'
const VIEW_DAY = 'timeGridDay'

const props = defineProps({
  events: {
    type: Array,
    required: true,
  },
})

const fullCalendar = ref(null)
const currentView = ref(VIEW_MONTH)
const currentDate = ref(new Date())
const isTodayActive = ref(false)

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: VIEW_MONTH,
  headerToolbar: false,
  buttonText: {
    today: 'Today',
    month: 'Month',
    week: 'Week',
    day: 'Day',
  },
  editable: true,
  selectable: true,
  timeZone: 'UTC',
  events: props.events,
  eventClick: handleEventClick,
  eventChange: handleEventChange,
  select: handleDateSelect,
  height: 'auto',
  eventDisplay: 'block',
  eventTimeFormat: {
    hour: 'numeric',
    minute: '2-digit',
    meridiem: 'short',
  },
  datesSet: handleDatesSet,
  slotMinTime: '08:00:00',
  slotMaxTime: '20:00:00',
  views: {
    [VIEW_DAY]: {
      dayHeaderFormat: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    },
  },
}))

const form = useForm({
  id: null,
  start: '',
  end: '',
})

const formattedDate = computed(() => {
  const options = { month: 'long', year: 'numeric' }
  return currentDate.value.toLocaleDateString('en-EN', options)
})

const checkIfToday = () => {
  if (fullCalendar.value) {
    const calendarApi = fullCalendar.value.getApi()
    const today = new Date()
    const currentStart = calendarApi.view.currentStart
    const currentEnd = calendarApi.view.currentEnd

    switch (currentView.value) {
      case VIEW_MONTH:
        isTodayActive.value =
          today.getFullYear() === currentStart.getFullYear() &&
          today.getMonth() === currentStart.getMonth()
        break
      case VIEW_WEEK:
        isTodayActive.value = today >= currentStart && today < currentEnd
        break
      case VIEW_DAY:
        isTodayActive.value = today.toDateString() === currentStart.toDateString()
        break
      default:
        isTodayActive.value = false
    }
  }
}

const handleEventClick = (info) => {
  router.visit(`/admin/dashboard/events/show/${info.event.id}`)
}

const handleDateSelect = (info) => {
  console.log('Date range selected:', info.startStr, 'to', info.endStr)
}

const handleEventChange = (changeInfo) => {
  form.id = changeInfo.event.id
  form.start = changeInfo.event.start.toISOString()
  form.end = changeInfo.event.end.toISOString()

  form.put(`/admin/dashboard/events/update/${form.id}/dates`, {
    preserveState: true,
    preserveScroll: true,
    onSuccess: () => {
      // Optionally show a success message
      console.log('Event updated successfully')
    },
    onError: (errors) => {
      // Revert the change if the server update fails
      changeInfo.revert()
      // Optionally show an error message
      console.error('Failed to update event', errors)
    },
  })
}

const changeView = (viewName) => {
  if (fullCalendar.value) {
    fullCalendar.value.getApi().changeView(viewName)
    currentView.value = viewName
  }
}

const goToToday = () => {
  fullCalendar.value?.getApi().today()
  checkIfToday()
}

const goToPrev = () => {
  fullCalendar.value?.getApi().prev()
  checkIfToday()
}

const goToNext = () => {
  fullCalendar.value?.getApi().next()
  checkIfToday()
}

const handleDatesSet = (dateInfo) => {
  currentDate.value = dateInfo.view.currentStart
  checkIfToday()
}
</script>

<template>
  <div class="relative">
    <button
      class="fixed bottom-4 right-9 w-14 h-14 btn btn-primary rounded-full shadow-xl flex items-center justify-center z-50 group"
      @click="() => $inertia.visit('/admin/dashboard/events/create')"
      aria-label="Create Event"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span
        class="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm py-1 px-2 rounded"
      >
        Create Event
      </span>
    </button>
  </div>

  <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
    <div class="flex items-center sm:justify-between gap-2">
      <button
        :class="['btn btn-sm', isTodayActive ? 'btn-neutral' : 'bg-base-100 text-base-content']"
        @click="goToToday"
      >
        Today
      </button>
      <button class="btn btn-sm bg-base-100 text-base-content" @click="goToPrev">&lt;</button>
      <button class="btn btn-sm bg-base-100 text-base-content" @click="goToNext">&gt;</button>
    </div>
    <h2 class="text-lg font-bold text-base-content capitalize">
      {{ formattedDate }}
    </h2>
    <div class="flex space-x-2">
      <button
        v-for="(label, view) in { [VIEW_MONTH]: 'Month', [VIEW_WEEK]: 'Week', [VIEW_DAY]: 'Day' }"
        :key="view"
        :class="[
          'btn btn-sm',
          currentView === view ? 'btn-neutral' : 'bg-base-100 text-base-content',
        ]"
        @click="changeView(view)"
      >
        {{ label }}
      </button>
    </div>
  </div>

  <div class="card bg-base-100 p-4 shadow-xl">
    <FullCalendar ref="fullCalendar" :options="calendarOptions" class="calendar-custom" />
  </div>
</template>

<style scoped>
.calendar-custom {
  --fc-border-color: hsl(var(--b3));
}

.calendar-custom :deep(.fc-col-header) {
  @apply bg-base-200 rounded-md;
}

.calendar-custom :deep(.fc-toolbar-title) {
  @apply text-lg font-bold;
}

.calendar-custom :deep(.fc-button) {
  @apply btn btn-sm btn-ghost;
}

.calendar-custom :deep(.fc-button-active) {
  @apply btn-neutral;
}

.calendar-custom :deep(.fc-event) {
  @apply bg-primary text-primary-content rounded-lg shadow-md border-none p-1;
}

.calendar-custom :deep(.fc-event-time) {
  font-weight: bold;
}

.calendar-custom :deep(.fc-event-title) {
  font-weight: normal;
}

.calendar-custom :deep(.fc-day-other) {
  @apply opacity-50;
}

.calendar-custom :deep(.fc-day-today) {
  background-color: hsl(var(--b2)) !important;
}

.calendar-custom :deep(.fc-col-header-cell) {
  @apply py-2;
}

.calendar-custom :deep(.fc-timegrid-slot) {
  border: none !important;
}

.calendar-custom :deep(.fc-timegrid-slot-lane)::after {
  content: '';
  @apply block w-full h-px bg-base-300;
}

.calendar-custom :deep(.fc-timegrid-slot-label) {
  @apply text-base-content opacity-70;
}

.calendar-custom :deep(.fc-timegrid-col) {
  border-left: none !important;
}
</style>
