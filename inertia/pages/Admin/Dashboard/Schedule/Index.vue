<script setup>
import { ref, computed } from 'vue'
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
  events: props.events,
  eventClick: handleEventClick,
  select: handleDateSelect,
  height: 'auto',
  eventDisplay: 'block',
  eventTimeFormat: {
    hour: 'numeric',
    minute: '2-digit',
    meridiem: 'short',
  },
  datesSet: handleDatesSet,
  views: {
    [VIEW_DAY]: {
      dayHeaderFormat: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    },
  },
}))

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
        isTodayActive.value = today.getFullYear() === currentStart.getFullYear() && 
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
  console.log('Event clicked:', info.event)
}

const handleDateSelect = (info) => {
  console.log('Date range selected:', info.startStr, 'to', info.endStr)
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
.calendar-custom :deep(.fc-toolbar-title) {
  @apply text-lg font-bold text-base-content;
}

button:focus {
  @apply outline-none ring-0;
}

button:disabled {
  @apply pointer-events-none cursor-default;
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
  @apply bg-base-200;
}

.calendar-custom :deep(.fc-col-header-cell) {
  @apply py-2;
}
</style>
