<template>
  <div v-if="activeMeeting" class="space-y-6 p-4 bg-white rounded-lg shadow">
    <!-- Header Section -->
    <div class="border-b pb-4">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ activeMeeting.name }}</h1>
          <p class="text-gray-600 mt-1">{{ formatDateTime(activeMeeting.date) }}</p>
        </div>
        <UBadge
          :color="getMeetingStatusColor()"
          :label="getMeetingStatus()"
          size="lg"
          class="capitalize"
        />
      </div>
    </div>

    <!-- Meeting Details -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Left Column -->
      <div class="space-y-6">
        <!-- Location -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Místo</h2>
          <div class="flex items-center gap-2 text-gray-600">
            <UIcon name="i-heroicons-map-pin" />
            <span>{{ activeMeeting.place }}</span>
          </div>
        </div>

        <!-- Description -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Popis</h2>
          <p class="text-gray-600">{{ activeMeeting.description }}</p>
        </div>

        <!-- Notes -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Poznámky</h2>
          <ul class="list-disc list-inside space-y-1">
            <li v-for="(note, index) in activeMeeting.notes" :key="index" class="text-gray-600">
              {{ note }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Participating Doctors -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Účastníci</h2>
          <div class="space-y-3">
            <div
              v-for="doctor in activeMeeting.doctors"
              :key="doctor.id"
              class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <UAvatar
                :alt="doctor.firstname + ' ' + doctor.surname"
                :text="doctor.firstname[0] + doctor.surname[0]"
              />
              <div>
                <div class="font-medium text-gray-900">
                  {{ doctor.firstname }} {{ doctor.surname }}
                </div>
                <div class="text-sm text-gray-500">{{ doctor.specialization }}</div>
                <div class="text-sm text-gray-500 flex items-center gap-2 mt-1">
                  <UIcon name="i-heroicons-envelope" class="text-gray-400" />
                  {{ doctor.email }}
                </div>
                <div class="text-sm text-gray-500 flex items-center gap-2">
                  <UIcon name="i-heroicons-phone" class="text-gray-400" />
                  {{ doctor.phone }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Patient Records -->
        <div v-if="activeMeeting.patientRecords.length > 0">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Pacienti</h2>
          <div class="space-y-4">
            <div
              v-for="patient in activeMeeting.patientRecords"
              :key="patient.id"
              class="p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex justify-between items-start">
                <div>
                  <div class="font-medium text-gray-900 text-lg">
                    {{ patient.name }} {{ patient.lastName }}
                  </div>
                  <div class="text-sm text-gray-500 mt-1">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-heroicons-identification" class="text-gray-400" />
                      <span>AIS ID: {{ patient.aisId }}</span>
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                      <UIcon name="i-heroicons-credit-card" class="text-gray-400" />
                      <span>Pojištění: {{ patient.insuranceId }}</span>
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                      <UIcon name="i-heroicons-calendar" class="text-gray-400" />
                      <span>Datum narození: {{ formatDate(patient.dateOfBirth) }}</span>
                    </div>
                  </div>
                </div>
                <UBadge :label="patient.gender" color="primary" />
              </div>
              
              <!-- Epikriza -->
              <div class="mt-3 pt-3 border-t border-gray-200">
                <h3 class="text-sm font-medium text-gray-700 mb-1">Epikriza</h3>
                <p class="text-sm text-gray-600">{{ patient.epikriza }}</p>
              </div>
              
              <!-- Modality -->
              <div v-if="patient.modality && patient.modality.length > 0" class="mt-3 pt-3 border-t border-gray-200">
                <h3 class="text-sm font-medium text-gray-700 mb-2">Zobrazovací vyšetření</h3>
                <div class="space-y-2">
                  <div 
                    v-for="mod in patient.modality" 
                    :key="mod.id"
                    class="bg-white p-2 rounded border border-gray-200"
                  >
                    <div class="flex justify-between items-start">
                      <div class="font-medium text-sm">{{ getModalityTypeName(mod.type) }}</div>
                      <div class="text-xs text-gray-500">{{ formatDate(mod.date) }}</div>
                    </div>
                    <div class="text-xs text-gray-500 mt-1">{{ mod.place }}</div>
                    <div class="text-sm text-gray-700 mt-1">{{ mod.results }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notification -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Notifikace</h2>
          <div class="flex items-center gap-2 text-gray-600">
            <UIcon name="i-heroicons-bell-alert" />
            <span>{{ activeMeeting.notification }} hodin před začátkem</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Reports Section -->
    <div v-if="activeMeeting.reports && activeMeeting.reports.length > 0" class="border-t pt-4">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Zprávy</h2>
      <div class="space-y-4">
        <div
          v-for="(report, index) in activeMeeting.reports"
          :key="index"
          class="p-4 bg-gray-50 rounded-lg"
        >
          <!-- Display report content based on its type -->
          <p class="text-gray-600">{{ typeof report === 'string' ? report : JSON.stringify(report) }}</p>
        </div>
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

const meetingStore = useMeetingStore();

const activeMeeting = computed(() => meetingStore.activeMeeting);

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