<template>
    <div class="p-6">
        <Timeline />
    </div>
</template>

<script setup>
import { useRecordsStore } from '@/stores/recordsStore';
import { pushSeeds } from '@/seeders/recordSeeder';

onMounted(() => {
    const recordsStore = useRecordsStore();
    pushSeeds(recordsStore);
});
</script>