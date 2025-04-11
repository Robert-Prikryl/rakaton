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
      
      <!-- Add Patient Button -->
      <div class="mb-8">
        <UButton 
          color="primary" 
          icon="i-heroicons-user-plus"
          @click="isModalOpen = true"
        >
          Add New Patient
        </UButton>
      </div>
  
      <!-- Patients Table -->
      <UTable
        :rows="patients"
        :columns="columns"
        :search="searchQuery"
        :sort="{ column: 'name', direction: 'asc' }"
        :loading="loading"
        @select="handleSelect"
      >
        <!-- Custom name column with avatar -->
        <template #name-data="{ row }">
          <div class="flex items-center gap-2">
            <UAvatar
              :src="row.avatar || ''"
              :alt="row.name"
              :text="getInitials(row.name)"
            />
            <span>{{ row.name }}</span>
          </div>
        </template>
  
        <!-- Custom date column -->
        <template #dateOfBirth-data="{ row }">
          {{ formatDate(row.dateOfBirth) }}
        </template>
  
        <!-- Custom actions column -->
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
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-eye"
              size="xs"
              @click="viewPatientDetails(row)"
            />
          </div>
        </template>
      </UTable>
  
      <!-- Add/Edit Patient Modal -->
      <UModal v-model="isModalOpen">
        <UCard>
          <template #header>
            <h3 class="text-xl font-semibold">
              {{ isEditing ? 'Edit Patient' : 'Add New Patient' }}
            </h3>
          </template>
          <PatientForm 
            :initial-data="selectedPatient"
            @submit="handleSubmit"
          />
        </UCard>
      </UModal>
    </div>
  </template>
  
  <script setup lang="ts">
  import { type Patient } from '~/types'
  
  const searchQuery = ref('')
  const isModalOpen = ref(false)
  const isEditing = ref(false)
  const selectedPatient = ref<Patient | null>(null)
  const loading = ref(false)
  
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
  
  // Example data with more realistic content
  const patients = ref([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+421 123 456 789',
      dateOfBirth: '1990-01-01',
      avatar: ''
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+421 987 654 321',
      dateOfBirth: '1985-05-15',
      avatar: ''
    }
  ])
  
  // Helper functions
  function getInitials(name: string) {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }
  
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }
  
  function handleSelect(rows: Patient[]) {
    console.log('Selected rows:', rows)
  }
  
  function viewPatientDetails(patient: Patient) {
    // Implement view details logic
    console.log('View patient details:', patient)
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
  
  async function handleSubmit(data: Patient) {
    loading.value = true
    try {
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
          ...data,
          avatar: ''
        })
      }
      
      isModalOpen.value = false
      isEditing.value = false
      selectedPatient.value = null
      
      const toast = useToast()
      toast.add({
        title: 'Success',
        description: isEditing.value ? 'Patient updated successfully' : 'Patient added successfully',
        color: 'success'
      })
    } catch (error) {
      const toast = useToast()
      toast.add({
        title: 'Error',
        description: 'Failed to save patient data',
        color: 'error'
      })
    } finally {
      loading.value = false
    }
  }
  </script>