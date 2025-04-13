<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center relative">
          <h1 class="text-2xl font-bold">🧬 Rakaton</h1>
          <p class="text-gray-500 mt-2">Přihlaste se pro pokračování</p>
          <div class="absolute right-0 top-0">
            <UDropdownMenu :items="loginOptions">
              <UButton color="gray" icon="i-heroicons-question-mark-circle" />
            </UDropdownMenu>
          </div>
        </div>
      </template>

      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Email" name="email" class="w-full">
          <UInput v-model="state.email" class="w-full" />
        </UFormField>

        <UFormField label="Heslo" name="password" class="w-full">
          <UInput v-model="state.password" type="password" class="w-full" />
        </UFormField>

        <UButton type="submit" color="primary" block :loading="loading">
          Přihlásit se
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

const loginOptions = [
  {
    label: 'Admin Login',
    icon: 'i-heroicons-user-circle',
    onSelect: () => fillCredentials({ email: 'admin@rakaton.cz', password: 'admin' })
  },
  {
    label: 'Doctor Login',
    icon: 'i-heroicons-user-circle',
    onSelect: () => fillCredentials({ email: 'doctor@rakaton.cz', password: 'doctor' })
  },
  {
    label: 'Manager Login',
    icon: 'i-heroicons-user-circle',
    onSelect: () => fillCredentials({ email: 'manager@rakaton.cz', password: 'manager' })
  },
  {
    label: 'Student Login',
    icon: 'i-heroicons-user-circle',
    onSelect: () => fillCredentials({ email: 'student@rakaton.cz', password: 'student' })
  }
]

function fillCredentials({ email, password }: { email: string; password: string }) {
    console.log(email, password)
  state.email = email
  state.password = password
}

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
        title: 'Úspěšně přihlášen',
        description: 'Úspěšně jste se přihlásili',
        color: 'success'
      })
    } else if (state.email === 'doctor@rakaton.cz' && state.password === 'doctor') {
      const auth = useAuth()
      localStorage.setItem('role', 'doctor')
      localStorage.setItem('doctorId', '1')
      auth.value.isAuthenticated = true
      router.push('/')
      toast.add({
        title: 'Úspěšně přihlášen',
        description: 'Úspěšně jste se přihlásili',
        color: 'success'
      })
    } else if (state.email === 'manager@rakaton.cz' && state.password === 'manager') {
      const auth = useAuth()
      localStorage.setItem('role', 'manager')
      auth.value.isAuthenticated = true
      router.push('/')
      toast.add({
        title: 'Úspěšně přihlášen',
        description: 'Úspěšně jste se přihlásili',
        color: 'success'
      })
    } else if (state.email === 'student@rakaton.cz' && state.password === 'student') {
      const auth = useAuth()
      localStorage.setItem('role', 'student')
      auth.value.isAuthenticated = true
      router.push('/')
      toast.add({
        title: 'Úspěšně přihlášen',
        description: 'Úspěšně jste se přihlásili',
        color: 'success'
      })
    } else {
      throw new Error('Invalid credentials')
    }
  } catch (error: any) {
    toast.add({
      title: 'Chyba',
      description: error.message || 'Nepodařilo se přihlásit',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script> 