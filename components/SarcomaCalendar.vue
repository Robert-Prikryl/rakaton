<template>
  <div class="calendar-wrapper">
    <UCalendar v-model="modelValue" @update:model-value="handleDateSelection">
      <template #day="{ day }">
        <UChip 
          :show="!!getColorByDate(day.toDate('UTC'))" 
          :color="getColorByDate(day.toDate('UTC'))" 
          size="2xs"
        >
          {{ day.day }}
        </UChip>
      </template>
    </UCalendar>
  </div>
</template>

<script setup lang="ts">
import { CalendarDate, type DateValue } from '@internationalized/date'
import { shallowRef } from 'vue'

const today = new Date()
const modelValue = shallowRef(new CalendarDate(today.getFullYear(), today.getMonth(), today.getDate())) 
type DateRange = {
  start: DateValue | undefined;
  end: DateValue | undefined;
}
const props = defineProps({
  highlightedDates: {
    type: Array as () => string[],
    default: () => []
  }
})

function getColorByDate(date: Date) {
  for (const highlightedDate of props.highlightedDates) {
    const highlightedDateObj = new Date(highlightedDate); // Convert string to Date object
    if (date.toDateString() === highlightedDateObj.toDateString()) {
      return 'warning';
    }
  }
  return undefined
}

function handleDateSelection(date: DateValue | DateRange | DateValue[] | null | undefined) {
  if (!date || Array.isArray(date)) {
    console.warn('Unsupported date type:', date);
    return;
  }
  console.log(`Selected date: ${date.toString()}`);
  // Check if the date is highlighted
  for (const highlightedDate of props.highlightedDates) {
    const highlightedDateObj = new Date(highlightedDate);
    if (date.toString() === highlightedDateObj.toDateString()) {
      // Perform an action if the selected date has a chip (is highlighted)
      console.log(`Date ${date.toString()} has a chip!`);
      // You can trigger any action here (e.g., show a modal, update state, etc.)
    }
  }
}
</script>

<style scoped>
.calendar-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
  /* Ensure calendar is responsive */
}

.u-chip--warning {
  background-color: yellow !important;
}

@media (max-width: 768px) {
  .calendar-wrapper {
    /* On smaller screens, make the calendar container full width */
    padding: 10px;
  }

  /* Optionally, you can adjust the calendar itself if needed */
  .u-calendar {
    width: 100%;
    font-size: 14px; /* Adjust font size for smaller screens */
  }
}

@media (max-width: 480px) {
  .calendar-wrapper {
    padding: 5px;
  }

  .u-calendar {
    width: 100%;
    font-size: 12px; /* Adjust font size further on very small screens */
  }
}
</style>
