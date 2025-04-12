<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <AppFooter />
    <HomeButton v-if="showHomeButton" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// Don't show the home button on the index page
const showHomeButton = computed(() => route.path !== '/')
</script> 