<template>
    <div v-if="activeMeeting" class="space-y-6 py-4 px-4 bg-white rounded-lg shadow">
      <!-- Header Section -->
      <div class="border-b pb-4">
        <div class="flex justify-between items-start">
          <div class="pr-2">
            <h1 class="text-xl font-bold text-gray-900 capitalize break-words">{{ activeMeeting.name }}</h1>
            <p class="text-gray-600 mt-1 text-sm">{{ formatDateWithTime(activeMeeting.date) }}</p>
          </div>
          <div class="flex flex-col items-end gap-2">
            <UBadge
                :color="getMeetingStatusColor()"
                :label="getMeetingStatus()"
                size="sm"
                class="capitalize"
            />
            <UButton
                size="sm"
                color="primary"
                @click="editMeeting"
                icon="i-heroicons-pencil-square"
            >
                Upravit
            </UButton>
            </div>
        </div>
      </div>
  
      <!-- Meeting Details (Single Column) -->
      <div class="space-y-6">
        <!-- Location -->
        <div>
          <h2 class="text-base font-semibold text-gray-900 mb-1">Místo</h2>
          <div class="flex items-center gap-2 text-gray-600 text-sm">
            <UIcon name="i-heroicons-map-pin" />
            <span>{{ activeMeeting.place }}</span>
          </div>
        </div>
  
        <!-- Description -->
        <div>
          <h2 class="text-base font-semibold text-gray-900 mb-1">Popis</h2>
          <p class="text-gray-600 text-sm break-words">{{ activeMeeting.description }}</p>
        </div>
  
        <!-- Notes -->
        <div>
        <h2 class="text-base font-semibold text-gray-900 mb-1">Poznámky</h2>
        <ul class="list-disc list-inside space-y-1 text-sm text-gray-600">
            <li v-for="(note, index) in activeMeeting.notes.split('\n')" :key="index">{{ note }}</li>
        </ul>
        </div>
  
        <!-- Notification -->
        <div>
          <h2 class="text-base font-semibold text-gray-900 mb-1">Notifikace</h2>
          <div class="flex items-center gap-2 text-gray-600 text-sm">
            <UIcon name="i-heroicons-bell-alert" />
            <span>{{ activeMeeting.notification }} hodin před začátkem</span>
          </div>
        </div>
  
        <!-- Participating Doctors -->
        <div>
          <h2 class="text-base font-semibold text-gray-900 mb-1">Účastníci</h2>
          <div class="space-y-3">
            <div v-for="doctor in activeMeeting.doctors" :key="doctor.id">
              <DoctorPreview :doctor="doctor" />
            </div>
          </div>
        </div>
      </div>
  
      <!-- Patient Records -->
      <div v-if="activeMeeting.patientRecords.length > 0" class="border-t pt-4">
        <div class="p-3 bg-blue-50 rounded-lg">
          <h2 class="text-base font-semibold text-gray-900 mb-2">Epikriza</h2>
          <p class="text-sm text-gray-600 break-words">{{ patient?.epikriza }}</p>
        </div>
      </div>
    </div>
    <div v-else class="p-4 text-center text-gray-500">
      Vyberte schůzku pro zobrazení detailů
    </div>
  </template>
  
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import { useMeetingStore } from '~/stores/meetingStore'; 
  const router = useRouter()

  const meetingStore = useMeetingStore();
  const activeMeeting = computed(() => meetingStore.activeMeeting);

  const patient = computed(() => activeMeeting.value?.patientRecords[0]);
  console.log('Active Meeting:', activeMeeting.value);

  // Format date and time
  function formatDateTime(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleString('cs-CZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function editMeeting() {
  if (!activeMeeting.value) return;
  // You can route to an edit page or open a modal
  router.push((`/meeting_editor?id=${activeMeeting.value.id}`))
}
  
  // Get meeting status and color based on date
  function getMeetingStatus(): string {
    if (!activeMeeting.value) return '';
    
    const meetingDate = new Date(activeMeeting.value.date);
    const now = new Date();
    
    if (meetingDate < now) {
      return 'Proběhlo';
    } else if (meetingDate.getTime() - now.getTime() <= 24 * 60 * 60 * 1000) {
      return 'Dnes';
    } else {
      return 'Naplánováno';
    }
  }
  
  function getMeetingStatusColor(): "neutral" | "success" | "primary" | "secondary" | "info" | "warning" | "error" | undefined {
    const status = getMeetingStatus();
    switch (status) {
      case 'Proběhlo':
        return 'neutral';
      case 'Dnes':
        return 'success';
      case 'Naplánováno':
        return 'primary';
      default:
        return 'neutral';
    }
  }
  
  // Format date for display
  function formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  // Format date with time in hh:mm dd.mm.yyyy format
  function formatDateWithTime(date: string | Date): string {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    
    return `${hours}:${minutes} ${day}.${month}.${year}`;
  }
  
  // Get modality type name
  function getModalityTypeName(type: string): string {
    switch (type) {
      case 'ct':
        return 'CT vyšetření';
      case 'mr':
        return 'Magnetická rezonance';
      case 'pet_ct':
        return 'PET/CT';
      case 'iné':
        return 'Jiné vyšetření';
      default:
        return type;
    }
  }
  </script>
  
  <style scoped>
  /* Add any component-specific styles here */
  </style>
  