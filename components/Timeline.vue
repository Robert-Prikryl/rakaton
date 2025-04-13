<template>
    <div class="relative w-full h-[5px] my-5">
      <div class="absolute w-full h-full bg-gray-200 rounded-2xl"></div>
      
      <!-- Month break markers with labels -->
      <div 
        v-for="(marker, index) in monthMarkers" 
        :key="'month-' + index"
        class="absolute top-1/2 -translate-y-1/2 z-10"
        :style="{ left: `${marker.position}%` }"
      >
        <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap capitalize">
          {{ getCzechMonth(marker.date) }}
        </div>
        <div class="w-0.5 h-3 bg-gray-300"></div>
      </div>

      <!-- Highlighted ranges -->
      <div 
        v-for="(range, index) in visibleHighlightedRanges" 
        :key="'highlight-' + index"
        class="absolute h-full rounded-2xl cursor-pointer transition-all duration-300 group z-10 hover:scale-y-125"
        :style="getHighlightStyle(range)"
        @click="recordsStore.setActiveRecord(range.id)"
      >
        <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100 scale-x-125">
          {{ range.description || `${formatDate(range.startDate)} - ${formatDate(range.endDate)}` }}
        </div>
      </div>

      <!-- Meeting points -->
      <div 
        v-for="(meeting, index) in visibleMeetings" 
        :key="index"
        class="absolute w-3 h-3 rounded-full top-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-300 hover:scale-125 group z-20"
        :style="getMeetingPointStyle(meeting.id)"
        @click="meetingStore.setActiveMeeting(meeting.id)"
      >
        <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100">
          {{ getMeetingTooltip(meeting) }}
        </div>
      </div>

      <!-- Today marker -->
      <div class="absolute left-[60%] top-1/2 -translate-y-1/2 w-[3px] h-3 bg-red-500 cursor-pointer transition-transform duration-300 hover:scale-125 group z-20">
        <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100">
          Dnes
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TimelinePoint, TimelineRange } from '@/types/timeline';
import { useRecordsStore } from '@/stores/recordsStore';
import type { Meeting } from '@/types/meeeting';
import { useMeetingStore } from '@/stores/meetingStore';

const recordsStore = useRecordsStore();
const meetingStore = useMeetingStore();

const today = new Date();

// Calculate date range limits
const twoMonthsAgo = new Date(today);
twoMonthsAgo.setMonth(today.getMonth() - 2);
twoMonthsAgo.setDate(1); // Start of the month

const oneMonthAhead = new Date(today);
oneMonthAhead.setMonth(today.getMonth() + 1);
oneMonthAhead.setDate(31); // End of the month

// Czech month names
const czechMonths = [
  'leden', 'únor', 'březen', 'duben', 'květen', 'červen',
  'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'
];

function getCzechMonth(date: Date): string {
  return czechMonths[date.getMonth()];
}

// Format date for tooltip
function formatDate(date: Date | string): string {
  const d = new Date(date);
  return `${d.getDate()}. ${getCzechMonth(d)}`;
}

// Format time for tooltip
function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
}

// Calculate month markers
const monthMarkers = computed(() => {
  const markers = [];
  const totalDays = Math.floor((oneMonthAhead.getTime() - twoMonthsAgo.getTime()) / (1000 * 60 * 60 * 24));
  const basePosition = 60; // Today is at 60%

  // Get start of current month
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  // Add markers for 2 months before and 1 month after
  for (let i = -2; i <= 1; i++) {
    const markerDate = new Date(currentMonth);
    markerDate.setMonth(currentMonth.getMonth() + i);
    
    const daysDiff = Math.floor((markerDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const position = basePosition + (daysDiff / totalDays * 100);
    
    // Only add markers that fall within the timeline (0-100%)
    if (position >= 0 && position <= 100) {
      markers.push({
        date: markerDate,
        position
      });
    }
  }
  
  return markers;
});

// Filter data points to only show those within the visible range
const visibleDataPoints = computed(() => {
  return recordsStore.records
    .filter((record): record is TimelinePoint => 'date' in record)
    .filter(point => {
      const date = new Date(point.date);
      return date >= twoMonthsAgo && date <= oneMonthAhead;
    });
});

// Filter highlighted ranges to only show those within the visible range
const visibleHighlightedRanges = computed(() => {
  return recordsStore.records
    .filter((record): record is TimelineRange => 'startDate' in record && 'endDate' in record)
    .filter(range => {
      const startDate = new Date(range.startDate);
      const endDate = new Date(range.endDate);
      
    // Check if the range overlaps with our visible timeline
    return (
      (startDate <= oneMonthAhead && endDate >= twoMonthsAgo) || // Range overlaps with our visible timeline
      (startDate >= twoMonthsAgo && startDate <= oneMonthAhead) || // Start date is within our visible timeline
      (endDate >= twoMonthsAgo && endDate <= oneMonthAhead) // End date is within our visible timeline
    );
  });
});

// Filter meetings to only show those within the visible range
const visibleMeetings = computed(() => {
  return meetingStore.meetings.filter(meeting => {
    const date = new Date(meeting.date);
    return date >= twoMonthsAgo && date <= oneMonthAhead;
  });
});

function getPointStyle(id: string) {
  const dateObj = new Date((recordsStore.records.find(record => record.id === id) as TimelinePoint).date);
  const daysDiff = Math.floor((dateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const totalDays = Math.floor((oneMonthAhead.getTime() - twoMonthsAgo.getTime()) / (1000 * 60 * 60 * 24));
  const basePosition = 60; // Today is at 60%
  
  // Calculate position based on days difference
  // If date is in the past, it will be before 60%
  // If date is in the future, it will be after 60%
  const position = basePosition + (daysDiff / totalDays * 100);
  
  return {
    left: `${position}%`,
    backgroundColor: (recordsStore.records.find(record => record.id === id) as TimelinePoint).color || '#000'
  };
}

function getHighlightStyle(range: TimelineRange) {
  const startDate = new Date(range.startDate);
  const endDate = new Date(range.endDate);
  const totalDays = Math.floor((oneMonthAhead.getTime() - twoMonthsAgo.getTime()) / (1000 * 60 * 60 * 24));
  const basePosition = 60; // Today is at 60%
  
  // Calculate start position
  const startDaysDiff = Math.floor((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const startPosition = basePosition + (startDaysDiff / totalDays * 100);
  
  // Calculate end position
  const endDaysDiff = Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const endPosition = basePosition + (endDaysDiff / totalDays * 100);
  
  // Calculate width and left position
  const left = Math.min(startPosition, endPosition);
  const width = Math.abs(endPosition - startPosition);
  
  return {
    left: `${left}%`,
    width: `${width}%`,
    backgroundColor: range.color || 'rgba(59, 130, 246, 0.3)' // Default to blue with 30% opacity
  };
}

// Get meeting point style
function getMeetingPointStyle(id: string) {
  const meeting = meetingStore.meetings.find(m => m.id === id);
  if (!meeting) return {};

  const dateObj = new Date(meeting.date);
  const daysDiff = Math.floor((dateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const totalDays = Math.floor((oneMonthAhead.getTime() - twoMonthsAgo.getTime()) / (1000 * 60 * 60 * 24));
  const basePosition = 60; // Today is at 60%
  
  const position = basePosition + (daysDiff / totalDays * 100);
  
  // Color based on meeting type
  const getMeetingColor = () => {
    switch (meeting.name) {
      case 'orl':
        return '#FF6B6B';
      case 'horni git':
        return '#4ECDC4';
      case 'hrudni':
        return '#45B7D1';
      case 'mammarni':
        return '#96CEB4';
      case 'plicni':
        return '#FFEEAD';
      case 'urologicky':
        return '#D4A5A5';
      case 'neurologicky':
        return '#9B59B6';
      case 'sarcomaboard':
        return '#E67E22';
      case 'onkogynekologicky':
        return '#FF9FF3';
      case 'dolni_git':
        return '#2ECC71';
      default:
        return '#666666';
    }
  };
  
  return {
    left: `${position}%`,
    backgroundColor: getMeetingColor()
  };
}

// Get meeting tooltip content
function getMeetingTooltip(meeting: Meeting): string {
  return `${meeting.name} - ${formatDate(meeting.date)} ${formatTime(meeting.date)}
${meeting.place}`;
}
</script>
