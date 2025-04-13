<template>
  <header class="bg-white shadow-md">
    <nav class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo/Brand -->
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-3xl"></span>
          <span class="text-2xl font-bold bg-gradient-to-r from-seagull-600 to-seagull-400 bg-clip-text text-transparent">
            Rakaton
          </span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-4">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="px-4 py-2 rounded-md hover:bg-seagull-100 transition-colors duration-200 cursor-pointer font-medium"
            :class="$route.path === item.path ? 'text-seagull-600 bg-seagull-50  ' : 'text-gray-700'"
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
                  class="flex items-center gap-2 hover:bg-seagull-100"
                >
                  <div class="flex items-center gap-2">
                    <UAvatar
                      :text="getInitials(userName)"
                      color="seagull"
                      class="text-white"
                    />
                    <div class="flex flex-col text-left">
                      <span class="font-semibold text-seagull-800">{{ userName }}</span>
                      <span class="text-xs text-seagull-500">{{ userRole }}</span>
                    </div>
                  </div>
                </UButton>
              </UDropdownMenu>
              <UDropdownMenu
                class="hidden lg:block"
                :modal="false"
                :items="notifications"
                :content="{
                  align: 'center',
                  side: 'bottom',
                  sideOffset: 8,
                  content: 'w-48',
                  item: 'px-2',
                }"
              >
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-bell"
                  class="flex items-center gap-2 relative hover:bg-seagull-100"
                >
                  <span v-if="unreadNotifications > 0" class="absolute -top-1 -right-1 flex h-4 w-4">
                    <span class="absolute inline-flex h-full w-full rounded-full bg-seagull-500 opacity-75 animate-ping"></span>
                    <span class="relative inline-flex rounded-full h-4 w-4 bg-seagull-600 text-[10px] text-white justify-center items-center">
                      {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
                    </span>
                  </span>
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
          @click="toggleMenu"
          aria-label="Toggle menu"
        />
      </div>

      <!-- Mobile Navigation -->
      <UCollapse :model-value="isOpen" class="md:hidden">
        <div class="flex flex-col space-y-1 py-4">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="px-4 py-3 rounded-md hover:bg-seagull-100 transition-colors duration-200 cursor-pointer font-medium"
            :class="$route.path === item.path ? 'text-seagull-600 bg-seagull-50' : 'text-gray-700'"
            @click="closeMenu"
          >
            {{ item.name }}
          </NuxtLink>
          
          <!-- Mobile user info and logout button -->
          <div class="px-4 py-3 mt-2 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <UAvatar
                  :text="getInitials(userName)"
                  color="seagull"
                  class="text-white"
                />
                <div class="flex flex-col">
                  <span class="font-semibold text-seagull-800">{{ userName }}</span>
                  <span class="text-xs text-seagull-500">{{ userRole }}</span>
                </div>
              </div>
              <UButton
                icon="i-heroicons-arrow-right-on-rectangle"
                variant="ghost" 
                color="gray"
                aria-label="Logout"
                class="cursor-pointer hover:bg-seagull-50 hover:text-seagull-600 transition-colors"
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

const isModalOpen = ref(false)

// Toggle menu function
const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

// Close menu function
const closeMenu = () => {
  isOpen.value = false
}

// Close menu when route changes
watch(() => route.path, () => {
  isOpen.value = false
})

// Notifications data - Mock data pro sarcomaboard schůzky v češtině
const notifications = ref([
  {
    id: 1,
    label: 'Nová schůzka sarcomaboardu',
    //description: 'Byla naplánována nová schůzka sarcomaboardu pro pacienta Novák J. (zítra, 10:00)',
    icon: 'i-lucide-calendar',
    read: false
  },
  {
    id: 2,
    label: 'Změna termínu schůzky',
    //description: 'Schůzka sarcomaboardu pro pacienta Dvořák M. byla přesunuta na 16.5.2023, 14:30',
    icon: 'i-lucide-calendar-clock',
    read: false
  },
  {
    id: 3,
    label: 'Připomenutí schůzky',
    //description: 'Připomínáme schůzku sarcomaboardu pro pacienta Svoboda T. (dnes, 13:00)',
    icon: 'i-lucide-bell-ring',
    read: false
  },
  {
    id: 4,
    label: 'Zápis ze schůzky',
    //description: 'K dispozici je nový zápis ze schůzky sarcomaboardu pacienta Novotný P.',
    icon: 'i-lucide-file-text',
    read: true
  },
  {
    id: 5,
    label: 'Zrušení schůzky',
    //description: 'Schůzka sarcomaboardu pro pacienta Horáková L. byla zrušena',
    icon: 'i-lucide-x-circle',
    read: true
  },
  {
    id: 6,
    label: 'Pozvánka na konzultaci',
    //description: 'Jste pozváni na konzultaci před schůzkou sarcomaboardu pacienta Koláře P.',
    icon: 'i-lucide-users',
    read: true
  }
])

// Počet nepřečtených notifikací
const unreadNotifications = computed(() => {
  return notifications.value.filter(notification => !notification.read).length
})

// Function to mark a notification as read
const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

// Function to mark all notifications as read
const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
}

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
    userName.value = 'Jan Novák'
    userRole.value = 'Doktor'
    navigationItems.value = [
      { name: 'Pacienti', path: '/patients' },
      { name: 'Schůzky', path: '/meeting' },
      { name: 'Vytvořit schůzku', path: '/create_meeting' }
    ]
  } else if (role === 'manager') {
    userName.value = 'J. Novák'
    userRole.value = 'Manažer'
    navigationItems.value = [
      { name: 'Pacienti', path: '/patients' },
      { name: 'Schůzky', path: '/meeting' },
      { name: 'Vytvořit schůzku', path: '/create_meeting' }
    ]
  } else if (role === 'admin') {
    userName.value = 'P. Novotný'
    userRole.value = 'Administrátor'
    navigationItems.value = [
      { name: 'Doktoři', path: '/doctors_table' }
    ]
  } else if (role === 'student') {
    userName.value = 'Petr Albrecht'
    userRole.value = 'Student'
    navigationItems.value = [
      { name: 'Přehled případů', path: '/cases_preview' }
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
  