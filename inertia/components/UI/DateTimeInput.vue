<script setup>
import { ref, computed, watch } from 'vue'
import { 
  generateTimeOptions, 
  getDefaultTime, 
  calculateEndTime, 
  isEndTimeValid,
  getTodayDate
} from '@/utils/date'

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

const today = getTodayDate()
const defaultTime = getDefaultTime()

const timeOptions = computed(() => generateTimeOptions())

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
      timeValue.value = calculateEndTime(startTime.substring(0, 5))
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
    if (!isEndTimeValid(startDate, startTime.substring(0, 5), dateValue.value, timeValue.value)) {
      timeValue.value = calculateEndTime(startTime.substring(0, 5))
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