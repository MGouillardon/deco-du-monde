<!-- components/UI/SearchableDropdown.vue -->
<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Search...',
  },
  itemKey: {
    type: String,
    default: 'id',
  },
  itemLabel: {
    type: String,
    default: 'name',
  },
})

const emit = defineEmits(['update:modelValue'])

const search = ref('')
const isOpen = ref(false)
const highlightedIndex = ref(-1)

const filteredItems = computed(() => {
  return props.items.filter((item) =>
    item[props.itemLabel].toLowerCase().includes(search.value.toLowerCase())
  )
})

const selectedItem = computed(() => {
  return props.items.find((item) => item[props.itemKey] == props.modelValue)
})

watch(filteredItems, () => {
  highlightedIndex.value = -1
})

const selectItem = (item) => {
  emit('update:modelValue', item[props.itemKey])
  search.value = ''
  isOpen.value = false
}

const handleKeydown = (e) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    highlightedIndex.value = (highlightedIndex.value + 1) % filteredItems.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    highlightedIndex.value =
      (highlightedIndex.value - 1 + filteredItems.value.length) % filteredItems.value.length
  } else if (e.key === 'Enter' && highlightedIndex.value !== -1) {
    e.preventDefault()
    selectItem(filteredItems.value[highlightedIndex.value])
  } else if (e.key === 'Escape') {
    isOpen.value = false
  }
}
</script>

<template>
  <div class="form-control w-full">
    <label v-if="label" class="label">
      <span class="label-text">{{ label }}</span>
    </label>
    <div class="dropdown w-full" :class="{ 'dropdown-open': isOpen }">
      <input
        type="text"
        :placeholder="placeholder"
        class="input input-bordered w-full"
        v-model="search"
        @focus="isOpen = true"
        @blur="setTimeout(() => (isOpen = false), 200)"
        @keydown="handleKeydown"
      />
      <div
        v-show="isOpen"
        class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-48 overflow-auto"
      >
        <div v-if="filteredItems.length === 0" class="text-center py-2 text-opacity-50">
          No results found
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          <button
            v-for="(item, index) in filteredItems"
            :key="item[itemKey]"
            class="btn btn-sm overflow-hidden"
            :class="{ 'btn-primary': index === highlightedIndex }"
            @mouseenter="highlightedIndex = index"
            @click.prevent="selectItem(item)"
          >
            {{ item[itemLabel] }}
          </button>
        </div>
      </div>
    </div>
    <div v-if="selectedItem" class="badge badge-primary mt-2">
      {{ selectedItem[itemLabel] }}
    </div>
  </div>
</template>
