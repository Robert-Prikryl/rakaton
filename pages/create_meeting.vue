<template>
  <div class="flex flex-col lg:flex-row">
    <!-- Main Content -->
    <div class="w-full lg:w-3/4 p-4">
      <MeetingForm @submitDate="handleDateSubmission"/>
    </div>
    
    <!-- Sidebar on the Right with Light Mode -->
    <div class="w-full lg:w-1/4 bg-white text-black p-4 shadow-lg mt-4 lg:mt-0">
      <!-- Adding SarcomaCalendar component here -->
      <SarcomaCalendar :highlightedDates="highlightedDates"/>
      <CalendarPlannedMeeting />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SarcomaCalendar from '@/components/SarcomaCalendar.vue';  // Adjust the path as needed

definePageMeta({
  colorMode: "light",
});

const highlightedDates = ref<string[]>([]);

function handleDateSubmission(date: string) {
  // Handle the date submission from the MeetingForm component
  console.log('Date submitted:', date);
  highlightedDates.value.push(date);
}
</script>

<style scoped>
/* Additional styling for the light mode sidebar */
@media (max-width: 1024px) {
  .sidebar {
    width: 100%;
    margin-top: 20px;
  }
}
</style>
