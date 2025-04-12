<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">🧬 Rakaton</h1>
          <p class="text-gray-500 mt-2">Please login to continue</p>
        </div>
      </template>

      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Email" name="email" class="w-full">
          <UInput v-model="state.email" class="w-full" />
        </UFormField>

        <UFormField label="Password" name="password" class="w-full">
          <UInput v-model="state.password" type="password" class="w-full" />
        </UFormField>

        <UButton type="submit" color="primary" block :loading="loading">
          Login
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import * as v from 'valibot'

definePageMeta({
    colorMode: "light",
    layout: false
})

const schema = v.object({
  email: v.pipe(v.string(), v.email('Invalid email')),
  password: v.string([v.minLength(1, 'Password is required')])
})

const state = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const toast = useToast()
const router = useRouter()

async function onSubmit(event: any) {
  loading.value = true
  try {
    // Here you would typically make an API call to verify credentials
    if (state.email === 'admin@rakaton.cz' && state.password === 'admin') {
      const auth = useAuth()
      localStorage.setItem('role', 'admin')
      auth.value.isAuthenticated = true
      router.push('/')
      toast.add({
        title: 'Success',
        description: 'Successfully logged in',
        color: 'success'
      })
    } else if (state.email === 'doctor@rakaton.cz' && state.password === 'doctor') {
      const auth = useAuth()
      localStorage.setItem('role', 'doctor')
      auth.value.isAuthenticated = true
      router.push('/')
      toast.add({
        title: 'Success',
        description: 'Successfully logged in',
        color: 'success'
      })
    } else if (state.email === 'manager@rakaton.cz' && state.password === 'manager') {
      const auth = useAuth()
      localStorage.setItem('role', 'manager')
      auth.value.isAuthenticated = true
      router.push('/')
      toast.add({
        title: 'Success',
        description: 'Successfully logged in',
        color: 'success'
      })
    } else if (state.email === 'student@rakaton.cz' && state.password === 'student') {
      const auth = useAuth()
      localStorage.setItem('role', 'student')
      auth.value.isAuthenticated = true
      router.push('/')
      toast.add({
        title: 'Success',
        description: 'Successfully logged in',
        color: 'success'
      })
    } else {
      throw new Error('Invalid credentials')
    }
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to login',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script> 