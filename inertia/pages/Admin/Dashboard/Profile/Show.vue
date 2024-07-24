<script setup>
import { useForm } from '@inertiajs/vue3'
import UserIcon from '@/components/icons/UserIcon.vue'
import EmailIcon from '@/components/icons/EmailIcon.vue'
import PasswordIcon from '@/components/icons/PwdIcon.vue'

const props = defineProps({
  user: Object,
})
const form = useForm({
  fullName: props.user.fullName,
  email: props.user.email,
})

const requestPasswordReset = () => {
  console.log('Password reset requested')
}

const updateProfile = () => {
  console.log('Profile update requested', form)
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
              <UserIcon class="w-5 h-5" />
              <input
                type="text"
                id="fullName"
                v-model="form.fullName"
                class="grow"
                placeholder="Your full name"
              />
            </label>
          </div>
          <div class="form-control mt-4">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <label class="input input-bordered flex items-center gap-2">
              <EmailIcon class="w-5 h-5" />
              <input type="email" :value="user.email" class="grow" />
            </label>
          </div>
          <div class="form-control mt-4">
            <label class="label">
              <span class="label-text">Role</span>
            </label>
            <input type="text" :value="user.roleName" class="input input-bordered" disabled />
          </div>
          <div class="card-actions justify-end mt-6">
            <button type="submit" class="btn btn-primary">Update Profile</button>
          </div>
        </form>
      </div>
    </div>
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-xl mb-4">Account Security</h2>
        <p>You can make a reset password request here. We will send you an email with instructions on how to reset your password.</p>
        <div class="card-actions">
          <button @click="requestPasswordReset" class="btn btn-secondary btn-block">
            <PasswordIcon class="w-5 h-5 mr-2" />
            Request Password Reset
          </button>
        </div>
      </div>
    </div>
  </div>
</template>