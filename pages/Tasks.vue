<template>
  <div class="container mx-auto px-4 py-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Úkoly</h1>
      <p class="text-gray-600">Přehled všech úkolů přiřazených k pacientům doktora {{ doctor?.firstname }} {{ doctor?.surname }}</p>
    </div>

    <!-- Tasks by patient -->
    <div v-if="doctorPatients.length > 0">
      <UCard v-for="patient in doctorPatients" :key="patient.id" class="mb-8">
        <!-- Patient info header -->
        <template #header>
          <div class="flex items-center">
            <UAvatar
              :text="getInitials(patient.name + ' ' + patient.lastName)"
              color="indigo"
              class="mr-3"
            />
            <div>
              <h2 class="text-lg font-semibold">{{ patient.name }} {{ patient.lastName }}</h2>
              <p class="text-sm text-gray-500">{{ patient.dateOfBirth ? formatDate(patient.dateOfBirth) : '' }}</p>
            </div>
          </div>
        </template>

        {{console.log('HAS PATIENT TASKS: ', hasPatientTasks(patient))}}
          
        <!-- Tasks for this patient -->
        <div v-if="hasPatientTasks(patient)" class="space-y-4">
          <div v-if="Array.isArray(patient.questions)">
            <div v-for="question in patient.questions" :key="question.id">
              <UCard 
                v-for="task in question.tasks || []" 
                :key="task.id" 
                class="mb-3 p-4"
              >
                {{console.log('TASK: ', task)}}
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <p class="font-semibold text-lg">{{ task.name }}</p>
                      <UBadge 
                        :color="getTaskStatusColor(task)" 
                        :label="getTaskStatus(task)"
                        size="sm"
                      />
                    </div>
                    
                    <UDivider class="my-2" />
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div class="flex items-center">
                        <UIcon name="i-heroicons-information-circle" class="mr-2 text-gray-400" />
                        <p class="text-sm text-gray-700">{{ task.description }}</p>
                      </div>
                      <div class="flex items-center">
                        <UIcon name="i-heroicons-calendar" class="mr-2 text-gray-400" />
                        <p class="text-xs text-gray-600">Vytvořeno: {{ formatDateWithTime(task.createdAt) }}</p>
                      </div>
                      <div class="flex items-center">
                        <UIcon name="i-heroicons-clock" class="mr-2 text-gray-400" />
                        <p class="text-xs" :class="isDeadlinePassed(task.deadline) && !task.realizedAt ? 'text-red-500 font-bold' : 'text-gray-600'">
                          Termín: {{ formatDateWithTime(task.deadline) }}
                        </p>
                      </div>
                      <div class="flex items-center">
                        <UIcon name="i-heroicons-bell" class="mr-2 text-gray-400" />
                        <p class="text-xs text-gray-600">Notifikace: {{ task.notificationTime }} hodin před termínem</p>
                      </div>
                      <div class="flex items-center">
                        <UIcon name="i-heroicons-check-circle" class="mr-2" :class="task.realizedAt ? 'text-green-500' : 'text-gray-400'" />
                        <p class="text-xs" :class="task.realizedAt ? 'text-green-600' : 'text-red-500'">
                          {{ task.realizedAt ? 'Dokončeno: ' + formatDateWithTime(task.realizedAt) : 'Není dokončeno' }}
                        </p>
                      </div>
                      <div class="flex items-center">
                        <UIcon name="i-heroicons-user" class="mr-2 text-gray-400" />
                        <p class="text-xs text-gray-600">Odpovědná osoba: {{ task.responsible ? (task.responsible.firstname + ' ' + task.responsible.surname) : 'Neurčeno' }}</p>
                      </div>
                    </div>
                    
                    <UDivider class="my-2" />
                    
                    <!-- Task actions -->
                    <div class="flex justify-end gap-2" v-if="!task.realizedAt">
                      <UButton
                        color="success"
                        variant="soft"
                        size="sm"
                        icon="i-heroicons-check"
                        @click="markTaskComplete(patient.id, '', task.id)"
                      >
                        Označit jako dokončené
                      </UButton>
                      <UButton
                        color="primary"
                        variant="ghost"
                        size="sm"
                        icon="i-heroicons-pencil-square"
                        @click="editTask(patient.id, '', task.id)"
                      >
                        Upravit
                      </UButton>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>
          </div>
          <div v-else-if="patient.questions && 'tasks' in patient.questions">
            <UCard 
              v-for="task in (patient.questions as QuestionsObject).tasks" 
              :key="task.id" 
              class="mb-3 p-4"
            >
              {{console.log('TASK: ', task)}}
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <p class="font-semibold text-lg">{{ task.name }}</p>
                    <UBadge 
                      :color="getTaskStatusColor(task)" 
                      :label="getTaskStatus(task)"
                      size="sm"
                    />
                  </div>
                  
                  <UDivider class="my-2" />
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-information-circle" class="mr-2 text-gray-400" />
                      <p class="text-sm text-gray-700">{{ task.description }}</p>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-calendar" class="mr-2 text-gray-400" />
                      <p class="text-xs text-gray-600">Vytvořeno: {{ formatDateWithTime(task.createdAt) }}</p>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-clock" class="mr-2 text-gray-400" />
                      <p class="text-xs" :class="isDeadlinePassed(task.deadline) && !task.realizedAt ? 'text-red-500 font-bold' : 'text-gray-600'">
                        Termín: {{ formatDateWithTime(task.deadline) }}
                      </p>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-bell" class="mr-2 text-gray-400" />
                      <p class="text-xs text-gray-600">Notifikace: {{ task.notificationTime }} hodin před termínem</p>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-check-circle" class="mr-2" :class="task.realizedAt ? 'text-green-500' : 'text-gray-400'" />
                      <p class="text-xs" :class="task.realizedAt ? 'text-green-600' : 'text-red-500'">
                        {{ task.realizedAt ? 'Dokončeno: ' + formatDateWithTime(task.realizedAt) : 'Není dokončeno' }}
                      </p>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-user" class="mr-2 text-gray-400" />
                      <p class="text-xs text-gray-600">Odpovědná osoba: {{ task.responsible ? (task.responsible.firstname + ' ' + task.responsible.surname) : 'Neurčeno' }}</p>
                    </div>
                  </div>
                  
                  <UDivider class="my-2" />
                  
                  <!-- Task actions -->
                  <div class="flex justify-end gap-2" v-if="!task.realizedAt">
                    <UButton
                      color="success"
                      variant="soft"
                      size="sm"
                      icon="i-heroicons-check"
                      @click="markTaskComplete(patient.id, '', task.id)"
                    >
                      Označit jako dokončené
                    </UButton>
                    <UButton
                      color="primary"
                      variant="ghost"
                      size="sm"
                      icon="i-heroicons-pencil-square"
                      @click="editTask(patient.id, '', task.id)"
                    >
                      Upravit
                    </UButton>
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </div>
        <div v-else class="text-center py-6">
          <UIcon name="i-heroicons-clipboard-document-check" class="mx-auto h-8 w-8 text-gray-400" />
          <p class="mt-2 text-sm text-gray-500">Pacient nemá přiřazené žádné úkoly</p>
        </div>
      </UCard>
    </div>
    
    <!-- Empty state -->
    <UCard v-else class="text-center py-10">
      <UIcon name="i-heroicons-clipboard-document-check" class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-lg font-medium text-gray-900">Žádné úkoly</h3>
      <p class="mt-1 text-sm text-gray-500">V současné době nejsou pro vybraného doktora žádné úkoly k zobrazení.</p>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { seedDoctors } from '~/seeders/doctorSeeder';
import type { Doctor } from '~/types/doctor';
import type { Patient, Task } from '~/types/patient';

// Define interface for the question structures
interface Question {
  id: string;
  name: string;
  tasks?: Task[];
}

// Define interface for questions object structure (as seen in some patients)
interface QuestionsObject {
  id?: string;
  tasks: Task[];
}

// Define interface for the extended patient with questions
interface ExtendedPatient extends Patient {
  questions?: Question[] | QuestionsObject;
}

const patientStore = usePatientStore();
const doctorStore = useDoctorStore();

// Doctor with ID 1
const doctorId = '1';
const doctor = computed<Doctor | undefined>(() => {
  return doctorStore.doctors.find(doc => doc.id === doctorId);
});

// Get only patients from the doctor with ID 1
const doctorPatients = computed<ExtendedPatient[]>(() => {
  if (!doctor.value) return [];
  return doctor.value.patients as ExtendedPatient[];
});

onMounted(() => {
  // Seed doctors data if needed
  seedDoctors();
  
  // Log the doctor's patients after loading
  if (doctor.value && doctor.value.patients) {
    console.log(`Loaded ${doctor.value.patients.length} patients for doctor ${doctor.value.firstname} ${doctor.value.surname}`);
  }
});

// Check if a patient has any tasks
function hasPatientTasks(patient: ExtendedPatient): boolean {
  console.log('Patient: ', patient);
  if (!patient.questions) return false;
  
  // Handle both array and object structure
  if (Array.isArray(patient.questions)) {
    return patient.questions.length > 0;
  } else if ('tasks' in patient.questions && Array.isArray(patient.questions.tasks)) {
    return patient.questions.tasks.length > 0;
  }
  
  return false;
}

// Format date display
function formatDate(date: string | Date): string {
  if (!date) return '-';
  
  try {
    const d = new Date(date);
    return d.toLocaleDateString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    console.error('Invalid date format:', date);
    return '-';
  }
}

// Format date with time display
function formatDateWithTime(date: string | Date): string {
  if (!date) return '-';
  
  try {
    const d = new Date(date);
    return d.toLocaleString('cs-CZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    console.error('Invalid date format:', date);
    return '-';
  }
}

// Get patient initials
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
}

// Check if deadline is passed
function isDeadlinePassed(deadline: string | Date): boolean {
  if (!deadline) return false;
  
  try {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    return deadlineDate < now;
  } catch (e) {
    return false;
  }
}

// Get task status
function getTaskStatus(task: Task): string {
  if (task.realizedAt) {
    return 'Dokončeno';
  } else if (isDeadlinePassed(task.deadline)) {
    return 'Po termínu';
  } else {
    const deadlineDate = new Date(task.deadline);
    const now = new Date();
    const diff = deadlineDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 1) {
      return 'Dnes';
    } else if (daysDiff <= 3) {
      return 'Blíží se termín';
    } else {
      return 'Aktivní';
    }
  }
}

// Get task status color
function getTaskStatusColor(task: Task): "neutral" | "success" | "primary" | "secondary" | "info" | "warning" | "error" | undefined {
  const status = getTaskStatus(task);
  switch (status) {
    case 'Dokončeno':
      return 'success';
    case 'Po termínu':
      return 'error';
    case 'Dnes':
      return 'warning';
    case 'Blíží se termín':
      return 'info';
    case 'Aktivní':
      return 'primary';
    default:
      return 'neutral';
  }
}

// Mark task as complete
async function markTaskComplete(patientId: string, questionId: string, taskId: string): Promise<void> {
  // Find the doctor
  if (!doctor.value) return;
  
  // Find the patient in the doctor's patients
  const patient = doctor.value.patients.find(p => p.id === patientId) as ExtendedPatient;
  if (!patient) return;
  
  if (Array.isArray(patient.questions)) {
    // Handle array structure
    const question = patient.questions.find(q => q.id === questionId);
    if (!question || !question.tasks) return;
    
    // Find and update the task
    const task = question.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Mark as complete
    task.realizedAt = new Date();
  } else if (patient.questions && 'tasks' in patient.questions) {
    // Handle object structure with type assertion
    const questionsObj = patient.questions as QuestionsObject;
    const task = questionsObj.tasks.find((t: Task) => t.id === taskId);
    if (!task) return;
    
    // Mark as complete
    task.realizedAt = new Date();
  } else {
    return;
  }
  
  // Here you would typically update the data in your store/backend
  // For now just log the completion
  console.log(`Task ${taskId} marked as complete for patient ${patientId}`);
  
  // Show success toast
  useToast().add({
    title: 'Úkol dokončen',
    description: `Úkol byl označen jako dokončený`,
    icon: 'i-heroicons-check-circle',
    color: 'success'
  });
}

// Edit task
function editTask(patientId: string, questionId: string, taskId: string): void {
  // Logic to edit task - this would typically open a modal or navigate to an edit page
  console.log(`Edit task ${taskId} for patient ${patientId}`);
  
  // Show info toast that this feature is not yet implemented
  useToast().add({
    title: 'Úprava úkolu',
    description: 'Tato funkce ještě není implementována',
    icon: 'i-heroicons-information-circle',
    color: 'info'
  });
}
  definePageMeta({
      colorMode: "light",
  });
</script>

<style>
/* Additional styling if needed */
</style>