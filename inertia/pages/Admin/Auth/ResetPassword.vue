<script setup>
import { useForm } from '@inertiajs/vue3'
import PasswordIcon from '@/components/icons/PwdIcon.vue'
import ErrorFieldMessage from '@/components/Messages/ErrorFieldMessage.vue'

const props = defineProps({
  token: String,
  errors: Object,
})

const form = useForm({
  token: props.token,
  password: '',
  password_confirmation: '',
})

const submit = () => {
  form.post('/admin/password/reset')
}
</script>

<template>
  <main class="flex items-center justify-center min-h-screen bg-base-200">
    <div class="card w-96 bg-base-100 shadow-xl">
      <form @submit.prevent="submit" class="card-body">
        <h1 class="card-title text-2xl font-bold text-center mb-6">Reset Your Password</h1>
        <div class="form-control">
          <label for="password" class="label">
            <span class="label-text">New Password</span>
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

        <div class="form-control mt-4">
          <label for="password_confirmation" class="label">
            <span class="label-text">Confirm New Password</span>
          </label>
          <label class="input input-bordered flex items-center gap-2">
            <PasswordIcon />
            <input
              type="password"
              id="password_confirmation"
              class="grow"
              placeholder="••••••••"
              v-model="form.password_confirmation"
              required
            />
          </label>
        </div>
        <ErrorFieldMessage
          v-if="errors && errors.password"
          :error="errors.password[0]"
          class="mt-2"
        />
        <div class="form-control mt-6">
          <button type="submit" class="btn btn-primary" :disabled="form.processing">
            {{ form.processing ? 'Resetting...' : 'Reset Password' }}
          </button>
        </div>
      </form>
    </div>
  </main>
</template>
