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
      :data="data"
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

const data = ref([
  {
    id: '4600',
    date: '2024-03-11T15:30:00',
    status: 'paid',
    email: 'james.anderson@example.com',
    amount: 594
  },
  {
    id: '4599',
    date: '2024-03-11T10:10:00',
    status: 'failed',
    email: 'mia.white@example.com',
    amount: 276
  },
  {
    id: '4598',
    date: '2024-03-11T08:50:00',
    status: 'refunded',
    email: 'william.brown@example.com',
    amount: 315
  },
  {
    id: '4597',
    date: '2024-03-10T19:45:00',
    status: 'paid',
    email: 'emma.davis@example.com',
    amount: 529
  },
  {
    id: '4596',
    date: '2024-03-10T15:55:00',
    status: 'paid',
    email: 'ethan.harris@example.com',
    amount: 639
  }
])

onMounted(() => {
    const patientStore = usePatientStore();
    seedPatients(patientStore);
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
