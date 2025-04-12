<template>
  <div class="flex">
    <!-- Main Content -->
    <div class="w-3/4 p-4">
      <MeetingForm @submitDate="handleDateSubmission"/>
    </div>
    
    <!-- Sidebar on the Right with Light Mode -->
    <div class="w-1/4 bg-white text-black p-4 shadow-lg">
    
      
      <!-- Adding SarcomaCalendar component here -->
      <SarcomaCalendar :highlightedDates="highlightedDates"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SarcomaCalendar from '@/components/SarcomaCalendar.vue';  // Adjust the path as needed

definePageMeta({
  colorMode: "light",
});
const highlightedDates = ref<string[]>([])

function handleDateSubmission(date: string) {
  // Handle the date submission from the MeetingForm component
  console.log('Date submitted:', date);
  highlightedDates.value.push(date);
}
</script>



<style scoped>

/* Additional styling for the light mode sidebar */
</style>
