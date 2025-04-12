<template>
  <div class="container mx-auto p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Schůzky</h1>
      
      <!-- Search Bar -->
      <div class="w-auto flex">

        <UButton label="Vytvořit novou schůzku" class="flex gap-6 mr-4" color="primary" variant="subtle" @click="navigateToMeeting" />
        
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search by name..."
          color="primary"
          class="shadow-sm"
        />
      </div>
    </div>

    <!-- Patients Table -->
    <ClientOnly>
      <UTable 
        loading-color="primary" 
        loading-animation="carousel"
        :columns="columns"
        :data="meetingsData"
        :search="searchQuery"
        :sort="{ column: 'name', direction: 'asc' }"
      />
    </ClientOnly>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="isDeleteModalOpen">
        <UButton label="Vymazat pacienta" id="delete-patient-button" class="flex gap-6 mr-4 hidden" color="primary" variant="subtle" />
        <template #header>
            <h3 class="text-xl font-semibold">Smazat pacienta</h3>
        </template>
        <template #body>
            <DeleteForm 
                @close="handleClose"
                @confirm="confirmDelete"
            />
        </template>
    </UModal>

    <!-- Edit Confirmation Modal -->
    <UModal v-model:open="isEditModalOpen">
          <UButton label="Upravit doktora" id="edit-doctor-button" class="flex gap-6 mr-4 hidden" color="primary" variant="subtle" />
          <template #header>
              <h3 class="text-xl font-semibold">Upravit doktora</h3>
          </template>
          <template #body>
              <PatientForm @submit="handleSubmit" :initial-data="selectedPatientData" />
          </template>
    </UModal>

  </div>
</template>

<script setup lang="ts">
import { type Meeting } from '~/types/meeeting'
import { seedMeetings } from '~/seeders/meetingSeeder'
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { useMeetingStore } from '@/stores/meetingStore';

const searchQuery = ref('')
const isModalOpen = ref(false)
const isEditing = ref(false)
const meetingsData = ref<Meeting[]>([])
let simplifiedMeetings = ref<Meeting[]>([])
const router = useRouter()
const isDeleteModalOpen = ref(false)
const isEditModalOpen = ref(false)
let selectedMeetingData = ref<Meeting | null>(null)
const meetingToDelete = ref<string | null>(null)
const meetingStore = useMeetingStore()

onMounted(() => {
    
    if (import.meta.client) {

        const specificColumnMeetings = computed(() => 
          meetingStore.meetings
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(meeting => ({
              id: meeting.id,
              name: meeting.name,
              place: meeting.place,
              date: formatDate(meeting.date)
            }))
        )

        meetingsData.value = specificColumnMeetings.value;
        console.log('Loaded meetings:', meetingsData.value);
    }
});

// Table columns configuration
const columns: TableColumn<Meeting>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => row.getValue('name')
  },
  {
    accessorKey: 'place',
    header: 'Place',
    cell: ({ row }) => row.getValue('place')
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => row.getValue('date'),
    sort: {
      column: 'date',
      direction: 'desc'
    }
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-2' }, [
        h(resolveComponent('UButton'), {
          color: 'primary',
          variant: 'ghost',
          icon: 'i-heroicons-magnifying-glass',
          size: 'xs',
          onClick: () => viewMeeting(row.original.id)
        }),
        h(resolveComponent('UButton'), {
          color: 'primary',
          variant: 'ghost',
          icon: 'i-heroicons-pencil-square',
          size: 'xs',
          onClick: () => navigateToSpecificMeeting(row.original.id)
        })
      ])
    }
  }
]

function navigateToMeeting() {
  router.push('/create_meeting')
}

function viewMeeting(id: string) {
  router.push(`/meeting_viewer?id=${id}`)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('cs-CZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
function handleClose() {
    isDeleteModalOpen.value = !isDeleteModalOpen.value
    isDeleteModalOpen.value = false
    meetingToDelete.value = null
}

// Modal functions
function openAddModal() {
  meetingsData.value = null
  isEditing.value = false
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  isEditing.value = false
  meetingsData.value = null
}

function editMeeting(meeting: Meeting) {
    isEditModalOpen.value = !isEditModalOpen.value
    selectedMeetingData.value = meeting
}

function deleteMeeting(id: string) {
  meetingToDelete.value = id
  isDeleteModalOpen.value = true
  document.getElementById('delete-meeting-button')?.click()
}

function confirmDelete() {
  if (meetingToDelete.value) {
    meetingsData.value = meetingsData.value.filter(m => m.id !== meetingToDelete.value)
    
    const toast = useToast()
    toast.add({
      title: 'Úspěch',
      description: 'Schůzka byla úspěšně smazána',
      color: 'green',
      icon: 'i-heroicons-check-circle'
    })
    
    isDeleteModalOpen.value = false
    meetingToDelete.value = null
  }
}

function navigateToSpecificMeeting(id: string) {
  router.push(`/meeting_editor?id=${id}`)
  // Alternative format if you prefer cleaner URLs:
  // router.push(`/meeting/${id}`)
}

function handleSubmit(data: Meeting) {
    // Ensure patientStore.patients is initialized before pushing to it
    if (!meetingStore.meetings) {
        meetingStore.meetings = []
    }
    
    // Create a new patient with the data
    const newMeeting = {
        ...data,
        id: data.id || Date.now().toString()
    }
    
    // Add the patient to the store
    meetingStore.meetings.push(newMeeting)
    
    // Initialize patientsData if it's null
    if (!meetingsData.value) {
        meetingsData.value = []
    }
    
    // Add to local data for table display
    meetingsData.value.push(newMeeting)
    console.log('meetingsData', meetingsData.value)

    // Close modal and reset state
    closeModal()
    
    // Show success toast
    const toast = useToast()
    toast.add({
        title: 'Úspěch',
        description: isEditing.value ? 'Schůzka byla úspěšně upravena' : 'Schůzka byla úspěšně přidána',
        color: 'success'
    })

    definePageMeta({
        colorMode: "light",
    });
}
</script>
