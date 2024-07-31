<script setup>
import { Link } from '@inertiajs/vue3'
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  actions: {
    type: Array,
    required: true,
  },
  startIndex: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['delete'])

const handleAction = (action, item) => {
  if (action.handler) {
    action.handler(item)
  } else if (action.event) {
    emit(action.event, item)
  }
}

const getCellContent = (item, column) => {
  const value = item[column.key]
  if (typeof value === 'object' && value !== null && 'value' in value && 'class' in value) {
    return value
  }
  return { value, class: '' }
}

const getActionLink = (action, item) => 
  typeof action.link === 'function' ? action.link(item) : action.link

const memoizedItems = computed(() => 
  props.items.map(item => ({
    ...item,
    memoKey: Object.values(item).join('|')
  }))
)
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in memoizedItems" :key="item.id" v-memo="[item.memoKey]">
            <td v-for="column in columns" :key="column.key">
              <span :class="getCellContent(item, column).class">
                {{ getCellContent(item, column).value }}
              </span>
            </td>
            <td class="flex gap-2">
              <template v-for="action in actions" :key="action.label">
                <Link
                  v-if="action.link"
                  class="btn btn-sm"
                  :class="action.class"
                  :href="getActionLink(action, item)"
                >
                  {{ action.label }}
                </Link>
                <button
                  v-else
                  class="btn btn-sm"
                  :class="action.class"
                  @click="handleAction(action, item)"
                >
                  {{ action.label }}
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>