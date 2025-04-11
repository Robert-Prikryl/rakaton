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
    <UTable
      :columns="columns"
      :rows="patients"
      :search="searchQuery"
      :sort="{ column: 'name' }"
    >
      <template #actions-data="{ row }">
        <div class="flex items-center gap-2">
          <UButton
            color="primary"
            variant="ghost"
            icon="i-heroicons-pencil-square"
            size="xs"
            @click="editPatient(row)"
          />
          <UButton
            color="red"
            variant="ghost"
            icon="i-heroicons-trash"
            size="xs"
            @click="deletePatient(row.id)"
          />
        </div>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
import { type Patient } from '~/types'

const searchQuery = ref('')
const isModalOpen = ref(false)
const isEditing = ref(false)
const selectedPatient = ref<Patient | null>(null)

// Table columns configuration
const columns = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    id: 'name'
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
    id: 'email'
  },
  {
    key: 'phone',
    label: 'Phone',
    id: 'phone'
  },
  {
    key: 'dateOfBirth',
    label: 'Date of Birth',
    sortable: true,
    id: 'dateOfBirth'
  },
  {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    id: 'actions'
  }
]

// Example data
const patients = ref([
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+421 123 456 789',
    dateOfBirth: '1990-01-01'
  }
])

// Modal functions
function openAddModal() {
  selectedPatient.value = null
  isEditing.value = false
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  isEditing.value = false
  selectedPatient.value = null
}

function editPatient(patient: Patient) {
  selectedPatient.value = patient
  isEditing.value = true
  isModalOpen.value = true
}

function deletePatient(id: number) {
  if (confirm('Are you sure you want to delete this patient?')) {
    patients.value = patients.value.filter(p => p.id !== id)
  }
}

function handleSubmit(data: Patient) {
  if (isEditing.value) {
    // Update existing patient
    const index = patients.value.findIndex(p => p.id === selectedPatient.value?.id)
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
  
  // Show success toast
  const toast = useToast()
  toast.add({
    title: 'Success',
    description: isEditing.value ? 'Patient updated successfully' : 'Patient added successfully',
    color: 'success'
  })
}
</script>
