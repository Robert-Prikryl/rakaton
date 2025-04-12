<template>
  <div class="container mx-auto p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Patients</h1>
      
      <!-- Search Bar -->
      <div class="w-72">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search patients..."
          color="gray"
        />
      </div>
    </div>
    
    <UModal title="Modal with title">
      <UButton label="Open" color="neutral" variant="subtle" />

      <template #body>
        <Placeholder class="h-48" />
      </template>
    </UModal>

    <!-- Patients Table -->
    <ClientOnly>
      <UTable
        :columns="columns"
        :data="patientsData"
        :search="searchQuery"
        :sort="{ column: 'name' }"
      />
    </ClientOnly>
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

onMounted(() => {
    // Create a new instance of the store to ensure correct hydration
    const patientStore = usePatientStore();
    
    // Execute seedPatients without arguments as it creates its own store instance
    seedPatients();
    
    // Use import.meta.client to ensure we only access localStorage on client-side
    if (import.meta.client) {
        // Get patients data from the store
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
  if (confirm('Are you sure you want to delete this patient?')) {
    patientsData.value = patientsData.value.filter(p => p.id !== id)
  }
}

function handleSubmit(data: Patient) {
  if (isEditing.value) {
    // Update existing patient
    const index = patients.value.findIndex(p => p.id === patientsData.value?.id)
    if (index !== -1) {
      patients.value[index] = { ...patients.value[index], ...data }
    }
  } else {
    // Add new patient
    patients.value.push({
      id: Date.now(),
      ...data
    })
  }
  
  // Close modal and reset state
  closeModal()
  definePageMeta({
    colorMode: "light",
    });
  // Show success toast
  const toast = useToast()
  toast.add({
    title: 'Success',
    description: isEditing.value ? 'Patient updated successfully' : 'Patient added successfully',
    color: 'success'
  })
}
</script>
