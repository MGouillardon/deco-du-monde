<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: String,
  label: String,
  min: String,
  max: String,
  required: Boolean,
  isEndTime: Boolean,
  startTime: String,
})

const emit = defineEmits(['update:modelValue'])

const dateValue = ref('')
const timeValue = ref('')

const combinedValue = computed(() => {
  if (dateValue.value && timeValue.value) {
    return `${dateValue.value}T${timeValue.value}`
  }
  return ''
})

const updateValue = () => {
  emit('update:modelValue', combinedValue.value)
}

const today = new Date().toISOString().split('T')[0]
const defaultTime = '08:00'

const timeOptions = computed(() => {
  const options = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      options.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`)
    }
  }
  return options
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      const [date, time] = newValue.split('T')
      dateValue.value = date
      timeValue.value = time.substring(0, 5)
    } else {
      dateValue.value = today
      timeValue.value = defaultTime
    }
    updateValue()
  },
  { immediate: true }
)

watch(
  () => props.startTime,
  (newValue) => {
    if (props.isEndTime && newValue) {
      const [startDate, startTime] = newValue.split('T')
      dateValue.value = startDate

      const startHour = parseInt(startTime.split(':')[0])
      const startMinute = parseInt(startTime.split(':')[1])

      let endHour = startHour
      let endMinute = startMinute + 30

      if (endMinute >= 60) {
        endHour++
        endMinute -= 60
      }

      if (endHour > 20) {
        endHour = 20
        endMinute = 0
      }

      timeValue.value = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`
      updateValue()
    }
  }
)

if (!props.modelValue) {
  dateValue.value = today
  timeValue.value = defaultTime
  updateValue()
}

const handleTimeChange = () => {
  if (props.isEndTime && props.startTime) {
    const [startDate, startTime] = props.startTime.split('T')
    if (dateValue.value === startDate && timeValue.value <= startTime) {
      const [hour, minute] = startTime.split(':')
      let newHour = parseInt(hour)
      let newMinute = parseInt(minute) + 30

      if (newMinute >= 60) {
        newHour++
        newMinute -= 60
      }

      if (newHour > 20) {
        newHour = 20
        newMinute = 0
      }

      timeValue.value = `${newHour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`
    }
  }
  updateValue()
}
</script>

<template>
  <div class="form-control">
    <label :for="label" class="label">
      <span class="label-text">{{ label }}</span>
    </label>
    <div class="flex flex-wrap gap-2">
      <input
        type="date"
        :id="`${label}-date`"
        v-model="dateValue"
        class="input input-bordered flex-1"
        :min="min ? min.split('T')[0] : undefined"
        :max="max ? max.split('T')[0] : undefined"
        :required="required"
        @change="updateValue"
      />
      <select
        :id="`${label}-time`"
        v-model="timeValue"
        class="select select-bordered flex-1"
        :required="required"
        @change="handleTimeChange"
      >
        <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
      </select>
    </div>
  </div>
</template>
