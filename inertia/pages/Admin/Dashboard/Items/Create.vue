<script setup>
import { useForm } from '@inertiajs/vue3'
import ErrorFieldMessage from '@/components/Messages/ErrorFieldMessage.vue'

const props = defineProps({
  title: String,
  errors: Object,
})

const form = useForm({
  name: '',
  description: '',
})

const submit = () => {
  form.post('/admin/dashboard/items/store')
}
</script>

<template>
  <div class="card mx-auto bg-base-100 shadow-xl">
    <form @submit.prevent="submit" class="card-body">
      <div class="form-control">
        <label for="name" class="label">
          <span class="label-text">Item Name</span>
        </label>
        <label class="input input-bordered flex items-center gap-2">
          <input
            type="text"
            id="name"
            class="grow"
            placeholder="Item name"
            v-model="form.name"
            required
          />
        </label>
        <ErrorFieldMessage v-if="errors?.name" :error="errors.name" class="mt-1" />
      </div>
      <label for="description" class="label">
        <span class="label-text">Description</span>
      </label>
      <textarea
        id="description"
        class="textarea textarea-bordered text-base"
        placeholder="Item description"
        v-model="form.description"
        rows="3"
        required
      ></textarea>
      <ErrorFieldMessage v-if="errors?.description" :error="errors.description" class="mt-1" />
      <div class="form-control mt-6">
        <button type="submit" class="btn btn-primary" :disabled="form.processing">
          {{ form.processing ? 'Creating...' : 'Create Item' }}
        </button>
      </div>
    </form>
  </div>
</template>
