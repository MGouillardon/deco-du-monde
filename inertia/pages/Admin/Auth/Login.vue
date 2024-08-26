<script setup>
import { useForm } from '@inertiajs/vue3'
import { computed, ref, watch } from 'vue'
import EmailIcon from '@/components/icons/EmailIcon.vue'
import PasswordIcon from '@/components/icons/PwdIcon.vue'
import ErrorFieldMessage from '@/components/Messages/ErrorFieldMessage.vue'
import FlashMessage from '@/components/Messages/FlashMessage.vue'
import { useFlashMessage } from '@/composables/useFlashMessage'


const props = defineProps({
  errors: [Object, String],
  info: String,
})

const form = useForm({
  email: '',
  password: '',
})

const submit = () => {
  form.post('/admin/login')
}

const errorMessages = computed(() => {
  if (!props.errors) return []
  if (typeof props.errors === 'string') return [props.errors]
  return Object.values(props.errors).flat()
})

const { setFlashMessage } = useFlashMessage()

watch(
  () => props.info,
  (newInfo) => {
    if (newInfo) {
      setFlashMessage(newInfo, 'info')
    }
  },
  { immediate: true }
)
</script>

<template>
  <main class="flex items-center justify-center min-h-screen bg-base-200">
    <div class="card w-96 bg-base-100 shadow-xl">
      <form @submit.prevent="submit" class="card-body">
        <h1 class="card-title text-2xl font-bold text-center mb-6">Login</h1>
        <div class="form-control">
          <label for="email" class="label">
            <span class="label-text">Email</span>
          </label>
          <label class="input input-bordered flex items-center gap-2">
            <EmailIcon />
            <input
              type="email"
              id="email"
              class="grow"
              placeholder="your@email.com"
              v-model="form.email"
              required
            />
          </label>
        </div>

        <div class="form-control mt-4">
          <label for="password" class="label">
            <span class="label-text">Password</span>
          </label>
          <label class="input input-bordered flex items-center gap-2">
            <PasswordIcon />
            <input
              type="password"
              id="password"
              class="grow"
              placeholder="••••••••"
              v-model="form.password"
              required
            />
          </label>
        </div>

        <div v-if="errorMessages.length > 0" class="mt-4">
          <ErrorFieldMessage v-for="(error, index) in errorMessages" :key="index" :error="error" />
        </div>
        <div class="form-control mt-6">
          <button type="submit" class="btn btn-primary" :disabled="form.processing">
            {{ form.processing ? 'Logging in...' : 'Login' }}
          </button>
        </div>
      </form>
    </div>
  </main>
  <FlashMessage
    v-if="props.info"
    :show="showFlash"
    :type="flashType"
    :message="props.info"
    @dismiss="dismissFlash"
  />
</template>
