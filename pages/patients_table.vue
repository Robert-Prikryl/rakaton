<template>
    <div class="container mx-auto p-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Pacienti</h1>
        
        <!-- Search Bar -->
        <div class="w-72">
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass"
            placeholder="Hledat pacienty..."
            color="neutral"
          />
        </div>
      </div>

      <UModal v-model="isModalOpen" :title="isEditing ? 'Upravit pacienta' : 'Přidat nového pacienta'">
        <UButton 
          label="Přidat nového pacienta" 
          color="primary" 
          icon="i-heroicons-user-plus"
          @click="openAddPatientModal"
        />
        <template #body>
          <PatientForm 
            :initial-data="selectedPatient"
            @submit="handleSubmit"
          />
        </template>
      </UModal>
  
      <!-- Patients Table -->
      <UTable
        :data="filteredPatients"
        :columns="columns"
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
              color="error"
              variant="ghost"
              icon="i-heroicons-trash"
              size="xs"
              @click="deletePatient(row.id)"
            />
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-eye"
              size="xs"
              @click="viewPatientDetails(row)"
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
  const loading = ref(false)
  
  // Table columns configuration
  const columns = [
    {
      key: 'name',
      label: 'Jméno',
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
      label: 'Telefon',
      id: 'phone'
    },
    {
      key: 'dateOfBirth',
      label: 'Datum narození',
      sortable: true,
      id: 'dateOfBirth'
    },
    {
      key: 'actions',
      label: 'Akce',
      id: 'actions'
    }
  ]
  
  // Example data with more realistic content
  const patients = ref<Patient[]>([
    {
      id: 1,
      name: 'Jan Novák',
      email: 'jan@example.com',
      phone: '+420 123 456 789',
      dateOfBirth: '1990-01-01',
      avatar: ''
    },
    {
      id: 2,
      name: 'Marie Svobodová',
      email: 'marie@example.com',
      phone: '+420 987 654 321',
      dateOfBirth: '1985-05-15',
      avatar: ''
    }
  ])
  
  // Add this computed property after the patients ref
  const filteredPatients = computed(() => {
    if (!searchQuery.value) return patients.value
    
    const query = searchQuery.value.toLowerCase()
    return patients.value.filter(patient => 
      patient.name.toLowerCase().includes(query) ||
      patient.email.toLowerCase().includes(query) ||
      patient.phone.includes(query)
    )
  })
  
  definePageMeta({
    colorMode: "light",
  });
  // Helper functions
  function getInitials(name: string) {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }
  
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('cs-CZ', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }
  
  function handleSelect(row: any) {
    console.log('Vybraný řádek:', row)
  }
  
  function viewPatientDetails(patient: Patient) {
    console.log('Zobrazit detaily pacienta:', patient)
  }
  
  function editPatient(patient: Patient) {
    selectedPatient.value = patient
    isEditing.value = true
    isModalOpen.value = true
  }
  
  function deletePatient(id: number) {
    if (confirm('Opravdu chcete smazat tohoto pacienta?')) {
      patients.value = patients.value.filter(p => p.id !== id)
    }
  }

  function openAddPatientModal() {
    selectedPatient.value = null
    isEditing.value = false
    isModalOpen.value = true
  }
  
  async function handleSubmit(data: Patient) {
    loading.value = true
    try {
      if (isEditing.value && selectedPatient.value) {
        // Update existing patient
        const index = patients.value.findIndex(p => p.id === selectedPatient.value?.id)
        if (index !== -1) {
          patients.value[index] = { ...patients.value[index], ...data }
        }
      } else {
        // Add new patient
        const newPatient: Patient = {
          id: Date.now(),
          ...data,
          avatar: ''
        }
        patients.value.push(newPatient)
      }
      
      isModalOpen.value = false
      isEditing.value = false
      selectedPatient.value = null
      
      const toast = useToast()
      toast.add({
        title: 'Úspěch',
        description: isEditing.value ? 'Pacient byl úspěšně aktualizován' : 'Pacient byl úspěšně přidán',
        color: 'success'
      })
    } catch (error) {
      const toast = useToast()
      toast.add({
        title: 'Chyba',
        description: 'Nepodařilo se uložit data pacienta',
        color: 'error'
      })
    } finally {
      loading.value = false
    }
  }
  </script>