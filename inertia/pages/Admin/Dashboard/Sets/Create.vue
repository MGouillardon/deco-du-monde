<script setup>
import { useForm } from '@inertiajs/vue3'
import ErrorFieldMessage from '@/components/Messages/ErrorFieldMessage.vue'
import { ref, computed } from 'vue'

const props = defineProps({
  title: String,
  items: Array,
  errors: Object,
})

const form = useForm({
  name: '',
  description: '',
  itemIds: [],
})

const selectedItems = ref([])

const availableItems = computed(() => {
  return props.items.filter((item) => !selectedItems.value.includes(item.id))
})

const addItem = (itemId) => {
  itemId = parseInt(itemId, 10)
  if (itemId && !selectedItems.value.includes(itemId)) {
    selectedItems.value.push(itemId)
    form.itemIds = selectedItems.value
  }
}

const selectRef = ref(null)

const handleItemSelection = () => {
  const selectedValue = selectRef.value.value
  addItem(selectedValue)
  selectRef.value.value = ''
}

const removeItem = (itemId) => {
  selectedItems.value = selectedItems.value.filter((id) => id !== itemId)
  form.itemIds = selectedItems.value
}

const submit = () => {
  form.post('/admin/dashboard/sets/store')
}
</script>

<template>
  <div class="card mx-auto bg-base-100 shadow-xl">
    <form @submit.prevent="submit" class="card-body">
      <div class="form-control">
        <label for="name" class="label">
          <span class="label-text">Set Name</span>
        </label>
        <label class="input input-bordered flex items-center gap-2">
          <input
            type="text"
            id="name"
            class="grow"
            placeholder="Set name"
            v-model="form.name"
            required
          />
        </label>
        <ErrorFieldMessage v-if="errors?.name" :error="errors.name" class="mt-1" />
      </div>

      <div class="form-control">
        <label for="description" class="label">
          <span class="label-text">Description</span>
        </label>
        <textarea
          id="description"
          class="textarea textarea-bordered text-base"
          placeholder="Set description"
          v-model="form.description"
          rows="3"
          required
        ></textarea>
        <ErrorFieldMessage v-if="errors?.description" :error="errors.description" class="mt-1" />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Associated Items</span>
        </label>
        <div class="flex flex-wrap gap-2 mb-2">
          <div v-for="itemId in selectedItems" :key="itemId" class="badge badge-primary badge-lg">
            {{ props.items.find((i) => i.id === itemId)?.name || 'Unknown Item' }}
            <button type="button" @click="removeItem(itemId)" class="ml-2" aria-label="Remove item">
              &times;
            </button>
          </div>
        </div>
        <select
          ref="selectRef"
          @change="handleItemSelection"
          class="select select-bordered mt-2"
          aria-label="Add an item"
        >
          <option value="">Add an item</option>
          <option v-for="item in availableItems" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
        </select>
        <ErrorFieldMessage v-if="errors?.itemIds" :error="errors.itemIds" class="mt-1" />
      </div>

      <div class="form-control mt-6">
        <button type="submit" class="btn btn-primary" :disabled="form.processing">
          {{ form.processing ? 'Creating...' : 'Create Set' }}
        </button>
      </div>
    </form>
  </div>
</template>