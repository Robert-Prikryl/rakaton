<template>
  <div v-if="activeMeeting" class="space-y-6 py-4 px-6 md:px-12 bg-white rounded-lg shadow">
    <!-- Header Section -->
    <div class="border-b pb-4">
      <div class="flex justify-between items-start">
        <div class="flex items-center gap-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 capitalize">{{ activeMeeting.name }}</h1>
            <div class="flex items-center gap-2 mt-2">
              <p class="text-gray-600 mt-1">{{ formatDateWithTime(activeMeeting.date) }}</p> 
              <UBadge
                :color="getMeetingStatusColor()"
                :label="getMeetingStatus()"
                size="lg"
                class="capitalize"
              />
            </div>
          </div>
        </div>
        <div>
          <UButton
              v-if="activeMeeting.reports && activeMeeting.reports.length > 0"
              @click="downloadReport"
              class="capitalize item-center"
              color="primary"
              size="sm"
            >
              Stáhnout zápis pacienta
            </UButton>
        </div>
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
          <p class="text-gray-600">{{ activeMeeting.notes }}</p>
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

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Participating Doctors -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Účastníci</h2>
          <div class="space-y-3">
            <div v-for="doctor in activeMeeting.doctors" :key="doctor.id">
              <DoctorPreview :doctor="doctor" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Patient Records - Full Width -->
    <div v-if="activeMeeting.patientRecords.length > 0" class="border-t pt-6">
      <div class="p-4 bg-blue-50 rounded-lg">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Epikrize</h2>
        <p class="text-sm text-gray-600">{{ patient?.epikriza }}</p>
      </div>
    </div>

    <div v-if="patient?.modality && patient?.modality.length > 0" class="mt-3 pt-3 border-t border-gray-200">
        <div class="bg-white rounded-lg">
            <h2 class="text-lg font-semibold text-gray-900 mb-2">Relevantní vyšetření a výkony</h2>
            <div class="space-y-2">
                <div 
                v-for="mod in patient.modality" 
                :key="mod.id"
                class="p-4 rounded border border-gray-200"
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

    <!-- Questions Section -->
    <div v-if="activeMeeting.patientRecords.some(record => record.questions && record.questions.length > 0)" class="border-t pt-4">
      <div class="p-4 bg-blue-50 rounded-lg">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Otázky k projednání</h2>
        <div class="space-y-4">
          <div v-for="record in activeMeeting.patientRecords" :key="record.id">
            <div v-if="record.questions && record.questions.length > 0">
              <div class="font-medium text-gray-700 mb-2">{{ record.name }} {{ record.lastName }}</div>
              <div
                v-for="question in record.questions"
                :key="question.id"
                class="p-4 bg-white rounded-lg mb-2"
              >
                <div class="flex items-start gap-3">
                  <div class="flex-1">
                    <div class="flex justify-between items-start">
                      <div class="font-medium text-gray-900">{{ question.question }}</div>
                      <UBadge v-if="question.result"
                        color="primary"
                        size="sm"
                      >
                        {{ question.result }}
                      </UBadge>
                    </div>
                    <div class="text-sm text-gray-500 mt-1">
                      <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-user" class="text-gray-400" />
                        <span>Pro: {{ question.reciepient.firstname }} {{ question.reciepient.surname }}</span>
                      </div>
                      <div class="text-sm text-gray-600 mt-2">{{ question.note }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Reports Section -->
    <div v-if="activeMeeting.reports && activeMeeting.reports.length > 0" class="border-t pt-4">
      <div class="py-4 bg-white rounded-lg">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Závěr MDT</h2>
        <div class="space-y-4">
          <div
            v-for="(report, index) in activeMeeting.reports"
            :key="index"
            class="p-4 rounded-lg"
          >
            <!-- Display report content based on its type -->
            <p class="text-gray-600">{{ typeof report === 'string' ? report : JSON.stringify(report) }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Tasks Section -->
    <div v-if="patient?.questions[0].tasks && patient?.questions[0].tasks.length > 0" class="border-t pt-4">
      <div class="p-4 bg-blue-50 rounded-lg">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Úkoly</h2>
        <div class="space-y-4">
          <div v-for="question in patient.questions" :key="question.id" class="p-4 bg-white rounded-lg"> 
              <div v-for="task in question.tasks" :key="task.id" class="p-4 rounded-lg border-t border-gray-200">
                  <div class="flex items-start gap-3">
                      <div class="flex-1">
                          <div class="flex items-center">
                              <p class="font-2xl">{{ task.name }}</p>
                          </div>
                          <div class="flex items-center mt-1">
                              <UIcon name="i-heroicons-information-circle" class="mr-2 text-gray-400" />
                              <p class="text-sm text-gray-500">{{ task.description }}</p>
                          </div>
                          <div class="flex items-center mt-1">
                              <UIcon name="i-heroicons-calendar" class="mr-2 text-gray-400" />
                              <p class="text-xs text-gray-500">{{ formatDateWithTime(task.createdAt) }}</p>
                          </div>
                          <div class="flex items-center mt-1">
                              <UIcon name="i-heroicons-clock" class="mr-2 text-gray-400" />
                              <p class="text-xs text-gray-500">{{ formatDateWithTime(task.deadline) }}</p>
                          </div>
                          <div class="flex items-center mt-1">
                              <UIcon name="i-heroicons-bell" class="mr-2 text-gray-400" />
                              <p class="text-xs text-gray-500">{{ task.notificationTime }}</p>
                          </div>
                          <div class="flex items-center mt-1">
                              <UIcon name="i-heroicons-check-circle" class="mr-2 text-gray-400" />
                              <p class="text-xs" :class="task.realizedAt ? 'text-gray-500' : 'text-red-500'">{{ task.realizedAt ? formatDateWithTime(task.realizedAt) : 'Není dokončeno' }}</p>
                          </div>
                          <div class="flex items-center mt-1">
                              <UIcon name="i-heroicons-user" class="mr-2 text-gray-400" />
                              <p class="text-xs text-gray-500">{{ task.responsible.firstname + ' ' + task.responsible.surname }}</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
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
import DoctorPreview from '~/components/DoctorPreview.vue';
import { downloadDetailedReportUtils } from '@/utils/pdf_creator';

const meetingStore = useMeetingStore();

const activeMeeting = computed(() => meetingStore.activeMeeting);

const patient = computed(() => activeMeeting.value?.patientRecords[0]); // CHANGE THIS FOR BETTER PATIENT SELECTION

function downloadReport() {
  console.log('downloadReport');
  downloadReportUtils(activeMeeting.value, patient.value);
}

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