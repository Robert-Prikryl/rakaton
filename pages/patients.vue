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
      :data="patientsData"
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
import { type Patient } from '~/types/patient'
import { seedPatients } from '~/seeders/patientSeeder'

const searchQuery = ref('')
const isModalOpen = ref(false)
const isEditing = ref(false)
const patientsData = ref<Patient[]>([])
let simplifiedPatients = ref<Patient[]>([])

onMounted(() => {
    const patientStore = usePatientStore();
    seedPatients(patientStore);
    // simplifiedPatients.value = patientStore.patients.map(patient => ({
    //     id: patient.id,
    //     name: `${patient.name} ${patient.lastName}`
    // }));
    console.log(simplifiedPatients.value);
    patientsData.value = patientStore.patients;
    console.log(patientsData.value);
});



// Table columns configuration
const columns = [
    {
        key: 'id',
        label: 'ID',
        sortable: true,
        id: 'id'
    },
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
    key: 'status',
    label: 'Status',
    sortable: true,
    id: 'status'
  },
  {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    id: 'actions'
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

function deletePatient(id: number) {
  if (confirm('Are you sure you want to delete this patient?')) {
    patients.value = patients.value.filter(p => p.id !== id)
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
