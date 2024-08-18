<script setup>
import { useForm } from '@inertiajs/vue3'
import ErrorFieldMessage from '@/components/Messages/ErrorFieldMessage.vue'
import { ref, computed } from 'vue'

const props = defineProps({
  title: String,
  item: Object,
  statusOptions: Array,
  allSets: Array,
  errors: Object,
})

const form = useForm({
  name: props.item.name,
  description: props.item.description,
  isPhotographedStudio: Boolean(props.item.isPhotographedStudio),
  status: props.item.itemStatus?.status || props.statusOptions[0],
  notes: props.item.itemStatus?.notes || '',
  setIds: props.item.sets.map((set) => set.id),
})

const selectedSets = ref(props.item.sets.map((set) => set.id))

const availableSets = computed(() => {
  return props.allSets.filter((set) => !selectedSets.value.includes(set.id))
})

const addSet = (setId) => {
  setId = parseInt(setId, 10)
  if (setId && !selectedSets.value.includes(setId)) {
    selectedSets.value.push(setId)
    form.setIds = selectedSets.value
  }
}

const selectRef = ref(null)

const handleSetSelection = () => {
  const selectedValue = selectRef.value.value
  addSet(selectedValue)
  selectRef.value.value = ''
}

const removeSet = (setId) => {
  selectedSets.value = selectedSets.value.filter((id) => id !== setId)
  form.setIds = selectedSets.value
}

const submit = () => {
  form.put(`/admin/dashboard/items/update/${props.item.id}`)
}
</script>

<template>
  <div class="card mx-auto bg-base-100 shadow-xl">
    <form @submit.prevent="submit" class="card-body space-y-6 pb-8">
      <div class="form-control">
        <label for="name" class="label">
          <span class="label-text">Name</span>
        </label>
        <input
          type="text"
          id="name"
          class="input input-bordered"
          placeholder="Item name"
          v-model="form.name"
          required
          aria-required="true"
        />
        <ErrorFieldMessage v-if="errors?.name" :error="errors.name" class="mt-1" />
      </div>

      <div class="form-control">
        <label for="description" class="label">
          <span class="label-text">Description</span>
        </label>
        <textarea
          id="description"
          class="textarea textarea-bordered"
          placeholder="Item description"
          v-model="form.description"
          rows="3"
          aria-label="Item description"
        ></textarea>
        <ErrorFieldMessage v-if="errors?.description" :error="errors.description" class="mt-1" />
      </div>

      <div class="form-control">
        <label class="label cursor-pointer justify-start space-x-3">
          <input type="checkbox" v-model="form.isPhotographedStudio" class="checkbox" />
          <span class="label-text">Photographed in Studio</span>
        </label>
        <ErrorFieldMessage
          v-if="errors?.isPhotographedStudio"
          :error="errors.isPhotographedStudio"
          class="mt-1"
        />
      </div>

      <div class="form-control">
        <label for="status" class="label">
          <span class="label-text">Status</span>
        </label>
        <select class="select select-bordered" id="status" v-model="form.status">
          <option v-for="status in statusOptions" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
        <ErrorFieldMessage v-if="errors?.status" :error="errors.status" class="mt-1" />
      </div>

      <div class="form-control">
        <label for="notes" class="label">
          <span class="label-text">Notes</span>
        </label>
        <textarea
          id="notes"
          class="textarea textarea-bordered"
          placeholder="Additional notes"
          v-model="form.notes"
          rows="3"
          aria-label="Additional notes"
        ></textarea>
        <ErrorFieldMessage v-if="errors?.notes" :error="errors.notes" class="mt-1" />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Associated Sets</span>
        </label>
        <div class="flex flex-wrap gap-2 mb-2">
          <div v-for="setId in selectedSets" :key="setId" class="badge badge-primary badge-lg">
            {{ props.allSets.find((s) => s.id === setId)?.name || 'Unknown Set' }}
            <button type="button" @click="removeSet(setId)" class="ml-2" aria-label="Remove set">
              &times;
            </button>
          </div>
        </div>
        <select
          ref="selectRef"
          @change="handleSetSelection"
          class="select select-bordered mt-2"
          aria-label="Add a set"
        >
          <option value="">Add a set</option>
          <option v-for="set in availableSets" :key="set.id" :value="set.id">
            {{ set.name }}
          </option>
        </select>
        <ErrorFieldMessage v-if="errors?.setIds" :error="errors.setIds" class="mt-1" />
      </div>

      <div v-if="item.validations.length" class="form-control">
        <h3 class="text-lg font-semibold mb-2">Validations</h3>
        <ul>
          <li v-for="validation in item.validations" :key="validation.id">
            {{ validation.type }} -
            {{ validation.isValidated ? 'Validated' : 'Not Validated' }}
            <span v-if="validation.isValidated">
              by {{ validation.user?.fullName || 'Unknown' }} on
              {{ new Date(validation.validatedAt).toLocaleDateString() }}
            </span>
          </li>
        </ul>
      </div>

      <div class="form-control mt-6">
        <button type="submit" class="btn btn-primary" :disabled="form.processing">
          {{ form.processing ? 'Updating...' : 'Update Item' }}
        </button>
      </div>
    </form>
  </div>
</template>
