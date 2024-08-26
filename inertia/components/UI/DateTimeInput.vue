<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: String,
  label: String,
  min: String,
  max: String,
  required: Boolean,
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
  for (let hour = 8; hour < 20; hour++) {
    options.push(`${hour.toString().padStart(2, '0')}:00`)
    options.push(`${hour.toString().padStart(2, '0')}:30`)
  }
  options.push('20:00')
  return options
})

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const [date, time] = newValue.split('T')
    dateValue.value = date
    timeValue.value = time
  }
}, { immediate: true })

if (!props.modelValue) {
  dateValue.value = today
  timeValue.value = defaultTime
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
        @change="updateValue"
      >
        <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
      </select>
    </div>
  </div>
</template>