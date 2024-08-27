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

const combinedValue = computed(() => 
  dateValue.value && timeValue.value ? `${dateValue.value}T${timeValue.value}` : ''
)

const updateValue = () => emit('update:modelValue', combinedValue.value)

const today = new Date().toISOString().split('T')[0]
const defaultTime = '08:00'

const timeOptions = computed(() => {
  const options = []
  for (let hour = 8; hour <= 20; hour++) {
    const paddedHour = hour.toString().padStart(2, '0')
    options.push(`${paddedHour}:00`)
    if (hour < 20) options.push(`${paddedHour}:30`)
  }
  return options
})

const initializeValues = () => {
  if (!props.modelValue) {
    dateValue.value = today
    timeValue.value = defaultTime
    updateValue()
  }
}

const handleModelValueChange = (newValue) => {
  if (newValue) {
    [dateValue.value, timeValue.value] = newValue.split('T')
  }
}

const handleStartTimeChange = (newValue) => {
  if (props.isEndTime && newValue) {
    const [startDate, startTime] = newValue.split('T')
    dateValue.value = startDate

    const [startHour, startMinute] = startTime.split(':').map(Number)
    let endHour = startHour
    let endMinute = startMinute + 30

    if (endMinute >= 60) {
      endHour++
      endMinute -= 60
    }

    endHour = Math.min(endHour, 20)
    endMinute = endHour === 20 ? 0 : endMinute

    timeValue.value = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`
    updateValue()
  }
}

const handleTimeChange = () => {
  if (props.isEndTime && props.startTime) {
    const [startDate, startTime] = props.startTime.split('T')
    if (dateValue.value === startDate && timeValue.value <= startTime) {
      const [hour, minute] = startTime.split(':').map(Number)
      let newHour = hour
      let newMinute = minute + 30

      if (newMinute >= 60) {
        newHour++
        newMinute -= 60
      }

      newHour = Math.min(newHour, 20)
      newMinute = newHour === 20 ? 0 : newMinute

      timeValue.value = `${newHour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`
    }
  }
  updateValue()
}

watch(() => props.modelValue, handleModelValueChange, { immediate: true })
watch(() => props.startTime, handleStartTimeChange)

initializeValues()
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
        :min="min?.split('T')[0]"
        :max="max?.split('T')[0]"
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