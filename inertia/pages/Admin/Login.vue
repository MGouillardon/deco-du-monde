<script setup>
import { useForm } from '@inertiajs/vue3'
import EmailIcon from '../../components/icons/EmailIcon.vue'
import PasswordIcon from '../../components/icons/PwdIcon.vue'
import ErrorFieldMessage from '../../components/Messages/ErrorFieldMessage.vue'

const props = defineProps({
  success: String,
  errors: String,
})

const form = useForm({
  email: '',
  password: '',
})

const submit = () => {
  form.post('/admin/login')
}
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

        <ErrorFieldMessage v-if="props.errors" :error="[props.errors]" class="mt-4" />

        <div class="form-control mt-6">
          <button type="submit" class="btn btn-primary" :disabled="form.processing">
            {{ form.processing ? 'Logging in...' : 'Login' }}
          </button>
        </div>
      </form>
    </div>
  </main>
</template>