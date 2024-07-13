<script setup>
import EmailIcon from '../../components/icons/EmailIcon.vue'
import PasswordIcon from '../../components/icons/PwdIcon.vue'
import ErrorFieldMessage from '../../components/Messages/ErrorFieldMessage.vue'
import { useForm } from '@inertiajs/vue3'

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
  <div class="prose card w-96 p-6 bg-base-200 shadow-xl">
    <h1 class="text-center mb-0">Login</h1>
    <form class="card-body gap-4" @submit.prevent="submit">
      <label class="input input-bordered flex items-center gap-2">
        <EmailIcon />
        <input type="text" class="grow" placeholder="Email" v-model="form.email" />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        <PasswordIcon />
        <input type="password" class="grow" value="password" v-model="form.password" />
      </label>
      <ErrorFieldMessage
        v-if="props.errors"
        :error="['You have entered an invalid email or password.']"
      />
      <button class="btn btn-primary" type="submit">Login</button>
    </form>
  </div>
</template>
