<template>
  <div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-6">Meetings</h1>
    
    <!-- Add Meeting Button -->
    <div class="mb-8">
      <UButton 
        color="primary" 
        @click="isModalOpen = true"
      >
        Add New Meeting
      </UButton>
    </div>

    <!-- Meetings List -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <!-- Example Meeting Card - Replace with v-for when you have actual data -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Meeting Title</h3>
        </template>
        <p class="text-sm text-gray-600">Date: March 21, 2024</p>
        <p class="text-sm text-gray-600">Time: 14:00</p>
        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton color="gray" variant="ghost" size="sm">Edit</UButton>
            <UButton color="red" variant="ghost" size="sm">Delete</UButton>
          </div>
        </template>
      </UCard>
    </div>

    <!-- Add Meeting Modal -->
    <UModal v-model="isModalOpen">
      <UCard>
        <template #header>
          <h3 class="text-xl font-semibold">Create New Meeting</h3>
        </template>
        <MeetingForm @submit="handleSubmit" />
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const isModalOpen = ref(false)

const handleSubmit = (data: any) => {
  // Handle form submission
  console.log('Meeting data:', data)
  isModalOpen.value = false
}
</script>
