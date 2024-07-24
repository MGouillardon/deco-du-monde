<script setup>
import { useForm } from '@inertiajs/vue3'
import UserIcon from '@/components/icons/UserIcon.vue'
import EmailIcon from '@/components/icons/EmailIcon.vue'
import PasswordIcon from '@/components/icons/PwdIcon.vue'
import ErrorFieldMessage from '@/components/Messages/ErrorFieldMessage.vue'

const props = defineProps({
  user: Object,
  errors: Object,
})
const form = useForm({
  fullName: props.user.fullName,
  email: props.user.email,
})

const resetForm = useForm({})

const requestPasswordReset = () => {
  resetForm.post(`/admin/dashboard/profile/${props.user.id}/request-password-reset`, {
    preserveState: true,
    preserveScroll: true,
  })
}

const updateProfile = () => {
  form.put(`/admin/dashboard/profile/update/${props.user.id}`, form)
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-xl mb-4">Personal Information</h2>
        <form @submit.prevent="updateProfile">
          <div class="form-control">
            <label for="fullName" class="label">
              <span class="label-text">Full Name</span>
            </label>
            <label class="input input-bordered flex items-center gap-2">
              <UserIcon />
              <input
                type="text"
                id="fullName"
                v-model="form.fullName"
                class="grow"
                placeholder="Your full name"
              />
            </label>
          </div>
          <ErrorFieldMessage class="mt-2" v-if="props.errors" :error="props.errors.fullName" />
          <div class="form-control mt-4">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <label class="input input-bordered flex items-center gap-2">
              <EmailIcon />
              <input type="email" v-model="form.email" class="grow" />
            </label>
          </div>
          <ErrorFieldMessage class="mt-2" v-if="props.errors" :error="props.errors.email" />
          <div class="form-control mt-4">
            <label class="label">
              <span class="label-text">Role</span>
            </label>
            <input type="text" :value="user.roleName" class="input input-bordered" disabled />
          </div>
          <div class="card-actions justify-end mt-6">
            <button type="submit" class="btn btn-primary" :disabled="form.processing">
              {{ form.processing ? 'Updating...' : 'Update Profile' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-xl mb-4">Account Security</h2>
        <p>You can make a reset password request here. <br>We will send you an email with instructions on how to reset your password.</p>
        <div class="card-actions">
          <button
            @click="requestPasswordReset"
            class="btn btn-secondary btn-block"
            :disabled="resetForm.processing"
          >
            <PasswordIcon />
            {{ resetForm.processing ? 'Sending...' : 'Request Password Reset' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
