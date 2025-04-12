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
import { shallowRef, computed } from 'vue'
import { useMeetingStore } from '~/stores/meetingStore'

const today = new Date()
const modelValue = shallowRef(new CalendarDate(today.getFullYear(), today.getMonth(), today.getDate()))

const meetingStore = useMeetingStore()

// 🧠 Get color based on meeting status
function getMeetingStatusColor(meetingDate: Date): 'success' | 'neutral' {
  const now = new Date()
  if (meetingDate < now) {
    return 'neutral' // "Proběhlo"
  } else {
    return 'success' // "Naplánováno"
  }
}

// 🗓️ Prepare date -> color map
const meetingColorsByDate = computed(() => {
  const map = new Map<string, 'success' | 'neutral'>()
  for (const meeting of meetingStore.meetings) {
    const date = new Date(meeting.date)
    const key = date.toDateString()
    const color = getMeetingStatusColor(date)
    map.set(key, color)
  }
  return map
})

// 🎨 Get chip color by calendar date
function getColorByDate(date: Date): 'success' | 'neutral' | undefined {
  return meetingColorsByDate.value.get(date.toDateString())
}

function handleDateSelection(
  date: DateValue | { start: DateValue | undefined; end: DateValue | undefined } | DateValue[] | null | undefined
) {
  if (!date || Array.isArray(date)) return

  const selectedDate = new Date(date.toString()).toDateString()

  const selectedMeeting = meetingStore.meetings.find(meeting => {
    const meetingDate = new Date(meeting.date).toDateString()
    return meetingDate === selectedDate
  })

  if (selectedMeeting) {
    console.log(`Meeting exists on ${selectedDate}, ID: ${selectedMeeting.id}`)
    meetingStore.setActiveMeeting(selectedMeeting.id)
    // You can now use selectedMeeting.id here
  } else {
    console.log(`No meeting found on ${selectedDate}`)
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
