<script setup>
import { ref, computed } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const props = defineProps({
  events: Array,
  title: String,
})

const fullCalendar = ref(null)

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  editable: true,
  selectable: true,
  events: props.events,
  eventClick: handleEventClick,
  select: handleDateSelect,
}))

function handleEventClick(info) {
  console.log('Event clicked:', info.event)
  // Implémenter la logique d'édition d'événement ici
}

function handleDateSelect(info) {
  console.log('Date range selected:', info.startStr, 'to', info.endStr)
  // Implémenter la logique de création d'événement ici
}
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <FullCalendar
        ref="fullCalendar"
        :options="calendarOptions"
      />
    </div>
  </div>
</template>