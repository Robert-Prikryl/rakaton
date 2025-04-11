<template>
    <div class="p-6">
        <Timeline
            :dataPoints="[
                { 
                date: new Date('2025-03-15'),
                color: '#FFD700',
                description: 'Kontrola u lékaře'
                },
            ]"
        />
    </div>
</template>

<script setup>
import Timeline from '@/components/Timeline.vue';
</script>