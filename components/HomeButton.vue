<template>
  <NuxtLink 
    to="/" 
    class="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 group animate-pulse"
  >
    <UIcon 
      name="i-heroicons-light-bulb" 
      class="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300"
    />
    <span class="sr-only">Nápověda</span>
    
    <!-- Tooltip -->
    <div class="absolute bottom-full right-0 mb-2 hidden group-hover:block">
      <div class="bg-gray-900 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
        Nápověda
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
// No additional script needed
</script>

<style scoped>
/* Optional: Add a pulse animation */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(79, 70, 229, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(79, 70, 229, 0);
  }
}

.animate-pulse {
  animation: pulse 2s infinite;
}
</style> 