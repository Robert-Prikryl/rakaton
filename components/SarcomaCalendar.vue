<template>
    <div class="calendar-wrapper">
      <UCalendar
        v-model="selectedDate"
        :day-content="renderDay"
        class="w-full text-sm sm:text-base md:text-lg"
      />
  
      <div v-if="selectedDate" class="dummy-form mt-4 p-4 border rounded shadow">
        <h2 class="text-lg font-semibold mb-2">New Event for {{ selectedDate }}</h2>
        <form @submit.prevent="submitDummyForm">
          <div class="mb-2">
            <label class="block mb-1">Title</label>
            <input type="text" class="w-full border p-2 rounded" placeholder="Enter event title" />
          </div>
          <div class="mb-2">
            <label class="block mb-1">Description</label>
            <textarea class="w-full border p-2 rounded" placeholder="Enter event description"></textarea>
          </div>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Save (Dummy)
          </button>
        </form>
      </div>
  
      <p class="mt-4 text-center">You picked: {{ selectedDate }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { CalendarDate } from '@internationalized/date'
  
  const selectedDate = ref(new CalendarDate(2022, 2, 3))
  const submittedDates = ref(new Set())
  
  const submitDummyForm = () => {
    const key = selectedDate.value.toString() 
    submittedDates.value.add(key)
    alert("Dummy event saved for " + key)
  }
  
  const renderDay = (day) => {
  const key = day.toString()
  const isSubmitted = submittedDates.value.has(key)
  
  const isSelected = selectedDate.value && selectedDate.value.toString() === key

  return {
    class: isSubmitted || isSelected
      ? 'bg-blue-200 text-blue-800 font-semibold rounded-full'
      : ''
  }
}
  </script>
  
  <style scoped>
  .calendar-wrapper {
    max-width: 600px;
    margin: 0 auto;
  }
  
  :deep(.calendar-day) {
    width: 100%;
  }
  </style>