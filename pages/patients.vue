<template>
  <div class="container mx-auto p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Patients</h1>
      
      <!-- Search Bar -->
      <div class="w-auto flex">

        <UModal title="Modal with title">
            <UButton label="Vytvořit nového pacienta" class="flex gap-6 mr-4" color="primary" variant="subtle" />

            <template #body>
                <PatientForm :onSubmit="handleSubmit" />
            </template>
        </UModal>
        
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
        :data="patientsData"
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

  </div>
</template>

<script setup lang="ts">
import { type Patient } from '~/types/patient'
import { seedPatients } from '~/seeders/patientSeeder'
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const searchQuery = ref('')
const isModalOpen = ref(false)
const isEditing = ref(false)
const patientsData = ref<Patient[]>([])
let simplifiedPatients = ref<Patient[]>([])
const router = useRouter()
const isDeleteModalOpen = ref(false)
const patientToDelete = ref<string | null>(null)
const patientStore = usePatientStore()

onMounted(() => {
    seedPatients();
    
    if (import.meta.client) {
        patientsData.value = patientStore.patients;
        console.log('Loaded patients:', patientsData.value);
    }
});

// Table columns configuration
const columns: TableColumn<Patient>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'name',
    header: 'First Name',
    cell: ({ row }) => row.getValue('name')
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    cell: ({ row }) => row.getValue('lastName')
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: ({ row }) => row.getValue('gender')
  },
  {
    accessorKey: 'dateOfBirth',
    header: 'Date of Birth',
    cell: ({ row }) => row.getValue('dateOfBirth')
  },
  {
    accessorKey: 'aisId',
    header: 'AIS ID',
    cell: ({ row }) => row.getValue('aisId')
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
          onClick: () => navigateToPatient(row.original.id)
        }),
        h(resolveComponent('UButton'), {
          color: 'primary',
          variant: 'ghost',
          icon: 'i-heroicons-pencil-square',
          size: 'xs',
          onClick: () => editPatient(row.original)
        }),
        h(resolveComponent('UButton'), {
          color: 'error',
          variant: 'ghost',
          icon: 'i-heroicons-trash',
          size: 'xs',
          onClick: () => deletePatient(row.original.id)
        })
      ])
    }
  }
]

function handleClose() {
    isDeleteModalOpen.value = !isDeleteModalOpen.value
    isDeleteModalOpen.value = false
    patientToDelete.value = null
}

// Modal functions
function openAddModal() {
  patientsData.value = null
  isEditing.value = false
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  isEditing.value = false
  patientsData.value = null
}

function editPatient(patient: Patient) {
  patientsData.value = patient
  isEditing.value = true
  isModalOpen.value = true
}

function deletePatient(id: string) {
  patientToDelete.value = id
  isDeleteModalOpen.value = true
  document.getElementById('delete-patient-button')?.click()
}

function confirmDelete() {
  if (patientToDelete.value) {
    patientsData.value = patientsData.value.filter(p => p.id !== patientToDelete.value)
    
    const toast = useToast()
    toast.add({
      title: 'Úspěch',
      description: 'Pacient byl úspěšně smazán',
      color: 'green',
      icon: 'i-heroicons-check-circle'
    })
    
    isDeleteModalOpen.value = false
    patientToDelete.value = null
  }
}

function navigateToPatient(id: string) {
  router.push(`/patient?id=${id}`)
  // Alternative format if you prefer cleaner URLs:
  // router.push(`/patient/${id}`)
}

function handleSubmit(data: Patient) {
    // Ensure patientStore.patients is initialized before pushing to it
    if (!patientStore.patients) {
        patientStore.patients = []
    }
    
    // Create a new patient with the data
    const newPatient = {
        ...data,
        id: data.id || Date.now().toString()
    }
    
    // Add the patient to the store
    patientStore.patients.push(newPatient)
    
    // Initialize patientsData if it's null
    if (!patientsData.value) {
        patientsData.value = []
    }
    
    // Add to local data for table display
    patientsData.value.push(newPatient)
    console.log('patientsData', patientsData.value)

    // Close modal and reset state
    closeModal()
    
    // Show success toast
    const toast = useToast()
    toast.add({
        title: 'Úspěch',
        description: isEditing.value ? 'Pacient byl úspěšně upraven' : 'Pacient byl úspěšně přidán',
        color: 'success'
    })
}
</script>
