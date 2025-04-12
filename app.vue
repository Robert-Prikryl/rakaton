<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup>
// Apply auth middleware globally
definePageMeta({
  middleware: ['auth']
})

import { useRecordsStore } from '@/stores/recordsStore';
import { usePatientStore } from '@/stores/patientStore';
import { seedPatients } from '@/seeders/patientSeeder';
import { pushSeeds } from '@/seeders/recordSeeder';
import { seedMeetings } from '@/seeders/meetingSeeder';

const patientStore = usePatientStore();
onMounted(() => {
    seedPatients();
    patientStore.setActivePatient(patientStore.patients[0].id);
    const recordsStore = useRecordsStore();
    pushSeeds(recordsStore);
    seedMeetings();
});
</script>
