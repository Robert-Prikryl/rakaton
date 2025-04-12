<template>
  <header class="bg-white shadow-md">
    <nav class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo/Brand -->
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-3xl">🧬</span>
          <span class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Rakaton
          </span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-4">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="px-4 py-2 rounded-md hover:bg-indigo-50 transition-colors duration-200 cursor-pointer font-medium"
            :class="$route.path === item.path ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'"
          >
            {{ item.name }}
          </NuxtLink>
          
          <!-- User info and logout button -->
          <div class="flex items-center ml-6 pl-6 border-l border-gray-200">
            <div class="flex items-center gap-3">
              <UDropdownMenu
                class="hidden lg:block"
                :modal="false"
                :items="[
                  {
                    label: 'Úlohy',
                    icon: 'i-lucide-user',
                    to: '/tasks',
                  },
                  {
                    label: 'Odhlásit se',
                    icon: 'i-lucide-log-out',
                    onSelect: async (e) => {
                      handleLogout()
                    },
                  },
                ]"
                :content="{
                  align: 'center',
                  side: 'bottom',
                  sideOffset: 8,
                }"
              >
                <UButton
                  color="neutral"
                  variant="ghost"
                  class="flex items-center gap-2"
                >
                  <div class="flex items-center gap-2">
                    <UAvatar
                      :text="getInitials(userName)"
                      color="indigo"
                      class="text-white"
                    />
                    <div class="flex flex-col text-left">
                      <span class="font-semibold text-gray-800">{{ userName }}</span>
                      <span class="text-xs text-gray-500">{{ userRole }}</span>
                    </div>
                  </div>
                </UButton>
              </UDropdownMenu>
              <UDropdownMenu
                class="hidden lg:block"
                :modal="false"
                :items="[
                  {
                    label: 'Úlohy',
                    icon: 'i-lucide-user',
                    to: '/tasks',
                  },
                  {
                    label: 'Odhlásit se',
                    icon: 'i-lucide-log-out',
                    onSelect: async (e) => {
                      handleLogout()
                    },
                  },
                ]"
                :content="{
                  align: 'center',
                  side: 'bottom',
                  sideOffset: 8,
                }"
              >
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-bell"
                  class="flex items-center gap-2"
                >
                </UButton>
              </UDropdownMenu>
            </div>
          </div>
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
        <div class="flex flex-col space-y-1 py-4">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="px-4 py-3 rounded-md hover:bg-indigo-50 transition-colors duration-200 cursor-pointer font-medium"
            :class="$route.path === item.path ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'"
          >
            {{ item.name }}
          </NuxtLink>
          
          <!-- Mobile user info and logout button -->
          <div class="px-4 py-3 mt-2 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <UAvatar
                  :text="getInitials(userName)"
                  color="indigo"
                  class="text-white"
                />
                <div class="flex flex-col">
                  <span class="font-semibold text-gray-800">{{ userName }}</span>
                  <span class="text-xs text-gray-500">{{ userRole }}</span>
                </div>
              </div>
              <UButton
                icon="i-heroicons-arrow-right-on-rectangle"
                variant="ghost" 
                color="gray"
                aria-label="Logout"
                class="cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors"
                @click="handleLogout"
              />
            </div>
          </div>
        </div>
      </UCollapse>
    </nav>
  </header>
</template>

<script setup>
const isOpen = ref(false)
const router = useRouter()
const auth = useAuth()
const route = useRoute()
let navigationItems = ref([])
const userName = ref('User')
const userRole = ref('')

function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

onBeforeMount(() => {
  const role = localStorage.getItem('role')
  
  // Set the user name and role based on the logged in user
  if (role === 'doctor') {
    userName.value = 'Dr. Smith'
    userRole.value = 'Doktor'
    navigationItems.value = [
      { name: 'Pacienti', path: '/patients' },
      { name: 'Schůzky', path: '/meeting' },
      { name: 'Vytvořit schůzku', path: '/create_meeting' }
    ]
  } else if (role === 'manager') {
    userName.value = 'Manager Johnson'
    userRole.value = 'Manager'
    navigationItems.value = [
      { name: 'Pacienti', path: '/patients' },
      { name: 'Schůzky', path: '/meeting' },
      { name: 'Vytvořit schůzku', path: '/create_meeting' }
    ]
  } else if (role === 'admin') {
    userName.value = 'Admin User'
    userRole.value = 'Administrator'
    navigationItems.value = [
      { name: 'Doctors', path: '/doctors_table' }
    ]
  } else if (role === 'student') {
    userName.value = 'Student User'
    userRole.value = 'Student'
    navigationItems.value = [
      { name: 'Cases Preview', path: '/cases_preview' }
    ]
  } else {
    router.push('/login')
  }
})

function handleLogout() {
  auth.value.isAuthenticated = false
  localStorage.removeItem('role')
  router.push('/login')
}
</script>

<style scoped>
/* Add any additional styles here */
</style>
  