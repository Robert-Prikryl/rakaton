<template>
  <header class="border-b">
    <nav class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo/Brand -->
        <NuxtLink to="/" class="text-2xl font-bold text-indigo-600">
          🧬 Rakaton
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-6">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            {{ item.name }}
          </NuxtLink>
          <NuxtLink
            @click="handleLogout"
            class="px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            Logout
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <UButton
          icon="i-heroicons-bars-3"
          variant="ghost"
          color="gray"
          class="md:hidden"
          @click="isOpen = !isOpen"
        />
      </div>

      <!-- Mobile Navigation -->
      <UCollapse v-model="isOpen" class="md:hidden">
        <div class="flex flex-col space-y-2 py-4">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            {{ item.name }}
          </NuxtLink>
          <NuxtLink
            @click="handleLogout"
            class="px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            Logout
          </NuxtLink>
        </div>
      </UCollapse>
    </nav>
  </header>
</template>

<script setup>
const isOpen = ref(false)
const router = useRouter()
const auth = useAuth()
let navigationItems = ref([])

onBeforeMount(() => {
  const role = localStorage.getItem('role')
  if (role === 'doctor') {
        navigationItems = [
            { name: 'Patients', path: '/patients' },
            { name: 'Meetings', path: '/meeting' }
        ]
    } else if (role === 'manager') {
        navigationItems = [
            { name: 'Patients', path: '/patients' },
            { name: 'Meetings', path: '/meeting' },
            { name: 'Create Meetings', path: '/create_meeting' }
        ]
    } else if (role === 'admin') { 
        navigationItems = [
            { name: 'Doctors', path: '/doctors_table' }
        ]
    }else{
        router.push('/login')
    }
})

function handleLogout() {
  auth.value.isAuthenticated = false
  localStorage.removeItem('role')
  router.push('/login')
}
</script>

<style>
  
</style>
  