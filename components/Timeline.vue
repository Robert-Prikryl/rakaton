<template>
  <div class="relative w-full h-[5px] bg-gray-200 my-5">
    <div class="absolute w-full h-full bg-gray-200"></div>
    <!-- Month break markers with labels -->
    <div 
      v-for="(marker, index) in monthMarkers" 
      :key="'month-' + index"
      class="absolute top-1/2 -translate-y-1/2"
      :style="{ left: `${marker.position}%` }"
    >
      <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap capitalize">
        {{ getCzechMonth(marker.date) }}
      </div>
      <div class="w-0.5 h-3 bg-gray-300"></div>
    </div>
    <!-- Today marker -->
    <div class="absolute left-[60%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-500 cursor-pointer transition-transform duration-300 hover:scale-125 group">
      <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100">
        Dnes
      </div>
    </div>
    <div 
      v-for="(point, index) in visibleDataPoints" 
      :key="index"
      class="absolute w-3 h-3 rounded-full top-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-300 hover:scale-125 group"
      :style="getPointStyle(point.date)"
    >
      <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100">
        {{ point.description }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  dataPoints: {
    type: Array,
    required: true,
    default: () => []
  }
});

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

function getCzechMonth(date) {
  return czechMonths[date.getMonth()];
}

// Calculate month markers
const monthMarkers = computed(() => {
  const markers = [];
  const totalDays = Math.floor((oneMonthAhead - twoMonthsAgo) / (1000 * 60 * 60 * 24));
  const basePosition = 60; // Today is at 60%

  // Get start of current month
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  // Add markers for 2 months before and 1 month after
  for (let i = -2; i <= 1; i++) {
    const markerDate = new Date(currentMonth);
    markerDate.setMonth(currentMonth.getMonth() + i);
    
    const daysDiff = Math.floor((markerDate - today) / (1000 * 60 * 60 * 24));
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
  return props.dataPoints.filter(point => {
    const date = new Date(point.date);
    return date >= twoMonthsAgo && date <= oneMonthAhead;
  });
});

function getPointStyle(date) {
  const daysDiff = Math.floor((date - today) / (1000 * 60 * 60 * 24));
  const totalDays = Math.floor((oneMonthAhead - twoMonthsAgo) / (1000 * 60 * 60 * 24));
  const basePosition = 60; // Today is at 60%
  
  // Calculate position based on days difference
  // If date is in the past, it will be before 60%
  // If date is in the future, it will be after 60%
  const position = basePosition + (daysDiff / totalDays * 100);
  
  return {
    left: `${position}%`,
    backgroundColor: props.dataPoints.find(p => p.date === date)?.color || '#000'
  };
}
</script>
