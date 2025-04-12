<template>
    <div class="border-2 border-gray-300 rounded-lg m-8">
        <MeetingViewer />
        <div class="flex justify-end mr-8 m-4">
          <UModal title="Pridat pacienta">
              <UButton label="+ Pridat pacienta" class="flex gap-6 mr-4" color="primary" variant="subtle" />

              <template #body>
                  <AddPatientModal />
              </template>
          </UModal>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useMeetingStore } from '@/stores/meetingStore';
import { useRecordsStore } from '@/stores/recordsStore';
import { pushSeeds } from '@/seeders/recordSeeder';
import { seedMeetings } from '@/seeders/meetingSeeder';

const route = useRoute();
const meetingStore = useMeetingStore();
const addingPatient = ref(false);

onMounted(() => {
  const recordsStore = useRecordsStore();
  pushSeeds(recordsStore);
  seedMeetings();
  
  // Get meeting ID from URL parameter
  const meetingId = route.query.id as string;
  
  // Find and set active meeting if ID exists
  if (meetingId) {
    const meeting = meetingStore.meetings.find(m => m.id === meetingId);
    if (meeting) {
      meetingStore.setActiveMeeting(meeting.id);
    }
  } else {
    // Fallback to first meeting if no ID provided
    meetingStore.setActiveMeeting(meetingStore.meetings[0].id);
  }
});

definePageMeta({
  colorMode: "light",
});
</script>