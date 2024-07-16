<script setup>
import { useForm } from '@inertiajs/vue3'
import UserIcon from '@/components/icons/UserIcon.vue'
import EmailIcon from '@/components/icons/EmailIcon.vue'
import PasswordIcon from '@/components/icons/PwdIcon.vue'
import ErrorFieldMessage from '@/components/Messages/ErrorFieldMessage.vue'

const props = defineProps({
  success: String,
  errors: Object,
  roles: Array,
  user: Object,
})

const form = useForm({
  fullName: props.user.fullName,
  email: props.user.email,
  password: '',
  roleId: props.user.roleId,
})

const submit = () => {
  const formData = { ...form }
  if (!formData.password) {
    delete formData.password
  }
  form.put(`/admin/dashboard/users/update/${props.user.id}`, formData)
}
</script>

<template>
  {{ props.user }}
  <div class="card mx-auto bg-base-100 shadow-xl">
    <form @submit.prevent="submit" class="card-body">
      <div class="form-control">
        <label for="fullName" class="label">
          <span class="label-text">Full name</span>
        </label>
        <label class="input input-bordered flex items-center gap-2">
          <UserIcon />
          <input
            type="text"
            id="fullName"
            class="grow"
            placeholder="Full name"
            v-model="form.fullName"
            required
          />
        </label>
        <ErrorFieldMessage v-if="errors?.fullName" :error="errors.fullName" class="mt-1" />
      </div>

      <div class="form-control">
        <label for="role" class="label">
          <span class="label-text">Role</span>
        </label>
        <select id="role" v-model="form.roleId" class="select select-bordered grow" required>
          <option disabled value="">Select a role</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">
            {{ role.name }}
          </option>
        </select>
        <ErrorFieldMessage v-if="errors?.roleId" :error="errors.roleId" class="mt-1" />
      </div>

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
        <ErrorFieldMessage v-if="errors?.email" :error="errors.email" class="mt-1" />
      </div>

      <div class="form-control">
        <label for="password" class="label">
          <span class="label-text">Password (leave blank to keep current)</span>
        </label>
        <label class="input input-bordered flex items-center gap-2">
          <PasswordIcon />
          <input
            type="password"
            id="password"
            class="grow"
            placeholder="••••••••"
            v-model="form.password"
          />
        </label>
        <ErrorFieldMessage v-if="errors?.password" :error="errors.password" class="mt-1" />
      </div>

      <div class="form-control mt-6">
        <button type="submit" class="btn btn-primary" :disabled="form.processing">
          {{ form.processing ? 'Updating...' : 'Update' }}
        </button>
      </div>
    </form>
  </div>
</template>