<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup>
// Apply auth middleware globally
definePageMeta({
  middleware: ['auth']
})
</script>
