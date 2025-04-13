<template>
  <div class="relative">
    <!-- Question mark icon with hover trigger -->
    <div 
      class="cursor-help pb-1"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <UIcon 
        name="i-heroicons-question-mark-circle" 
        class="w-6 h-6 text-gray-600 hover:text-gray-800"
      />
    </div>

    <!-- Tooltip content -->
    <div 
      v-if="isHovered"
      class="absolute bottom-full right-0 w-56 -mb-10 bg-white rounded-lg shadow-lg p-3 z-50 border border-gray-200"
    >
      <h3 class="text-sm font-semibold mb-2">Typy konzilií</h3>
      <div class="space-y-2">
        <div 
          v-for="(item, index) in legendItems" 
          :key="index"
          class="flex items-center gap-2"
        >
          <div 
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: item.color }"
          ></div>
          <span class="text-xs text-gray-700">{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isHovered = ref(false)

const legendItems = [
  {
    label: 'ORL',
    color: '#FF6B6B'
  },
  {
    label: 'Horní GIT',
    color: '#4ECDC4'
  },
  {
    label: 'Hrudní',
    color: '#45B7D1'
  },
  {
    label: 'Mamární',
    color: '#96CEB4'
  },
  {
    label: 'Plicní',
    color: '#FFEEAD'
  },
  {
    label: 'Urologický',
    color: '#D4A5A5'
  },
  {
    label: 'Neurologický',
    color: '#9B59B6'
  },
  {
    label: 'Sarcomaboard',
    color: '#E67E22'
  },
  {
    label: 'Onkogynekologický',
    color: '#FF9FF3'
  },
  {
    label: 'Dolní GIT',
    color: '#2ECC71'
  }
]
</script>

<style scoped>
/* Optional: Add smooth transition */
.absolute {
  transition: opacity 0.2s ease-in-out;
}
</style> 