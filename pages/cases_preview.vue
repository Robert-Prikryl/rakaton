<template>
    <div class="container mx-auto p-8">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <UCard class="bg-white">
          <div class="text-center">
            <div class="text-2xl font-bold">{{ patientsData.length }}</div>
            <div class="text-gray-600">Celkový počet pacientů</div>
          </div>
        </UCard>
        <UCard class="bg-white">
          <div class="text-center">
            <div class="text-2xl font-bold text-primary">{{ activePatients }}</div>
            <div class="text-gray-600">V léčbě</div>
          </div>
        </UCard>
        <UCard class="bg-white">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ completedTreatments }}</div>
            <div class="text-gray-600">Dokončené léčby</div>
          </div>
        </UCard>
        <UCard class="bg-white">
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">{{ criticalCases }}</div>
            <div class="text-gray-600">Kritické případy</div>
          </div>
        </UCard>
      </div>
  
      <!-- Main Header and Search Section (preserved from original) -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Pacienti</h1>
        
        <!-- Search Bar -->
        <div class="w-auto flex">
  
          <!-- <UModal title="Vytvořit nového pacienta">
              <UButton label="Vytvořit nového pacienta" class="flex gap-6 mr-4" color="primary" variant="subtle" />
  
              <template #body>
                  <PatientForm :onSubmit="handleSubmit" />
              </template>
          </UModal> -->
          
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass"
            placeholder="Hledat podle jména..."
            color="primary"
            class="shadow-sm"
          />
        </div>
      </div>
  
      <!-- Quick Filters -->
      <div class="flex gap-2 mb-6 flex-wrap">
        <UBadge
          v-for="filter in quickFilters"
          :key="filter.label"
          :label="filter.label"
          :color="filter.color"
          variant="soft"
          class="cursor-pointer"
          @click="applyQuickFilter(filter.value)"
        />
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
  
      <!-- New Educational Sidebar -->
      <USlideover v-model="showEducationalSidebar">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-semibold">Learning Resources</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="showEducationalSidebar = false" />
          </div>
        </template>
        <template #body>
          <div class="space-y-6 p-4">
            <!-- Case Statistics -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium mb-3">Quick Statistics</h4>
              <ul class="space-y-2">
                <li>Average treatment duration: {{ avgTreatmentDuration }} days</li>
                <li>Success rate: {{ successRate }}%</li>
                <li>Common conditions: {{ commonConditions.join(', ') }}</li>
              </ul>
            </div>
  
            <!-- Medical Guidelines -->
            <div class="border-l-2 border-primary p-4">
              <h4 class="font-medium mb-3">Related Guidelines</h4>
              <ul class="space-y-2">
                <li v-for="guide in medicalGuidelines" :key="guide.id" class="flex items-center">
                  <UIcon name="i-heroicons-document-text" class="mr-2" />
                  <a :href="guide.url" target="_blank" class="text-primary hover:underline">
                    {{ guide.title }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </USlideover>
  
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
  const isEditModalOpen = ref(false)
  let selectedPatientData = ref<Patient | null>(null)
  const patientToDelete = ref<string | null>(null)
  const patientStore = usePatientStore()
  
  // New refs for educational features
  const showEducationalSidebar = ref(false)
  const quickFilters = [
    { label: 'Kritické případy', color: 'red', value: 'critical' },
    { label: 'Nedávno aktualizované', color: 'blue', value: 'recent' },
    { label: 'Dlouhodobá léčba', color: 'purple', value: 'longterm' },
    { label: 'Noví pacienti', color: 'green', value: 'new' }
  ]
  
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
      header: 'Jméno',
      cell: ({ row }) => row.getValue('name')
    },
    {
      accessorKey: 'lastName',
      header: 'Příjmení',
      cell: ({ row }) => row.getValue('lastName')
    },
    {
      accessorKey: 'gender',
      header: 'Pohlaví',
      cell: ({ row }) => row.getValue('gender')
    },
    {
      accessorKey: 'dateOfBirth',
      header: 'Datum narození',
      cell: ({ row }) => row.getValue('dateOfBirth')
    },
    {
      accessorKey: 'aisId',
      header: 'AIS ID',
      cell: ({ row }) => row.getValue('aisId')
    },
    {
      accessorKey: 'actions',
      header: 'Akce',
      cell: ({ row }) => {
        return h('div', { class: 'flex items-center gap-2' }, [
          h(resolveComponent('UButton'), {
            color: 'primary',
            variant: 'ghost',
            icon: 'i-heroicons-magnifying-glass',
            size: 'xs',
            onClick: () => navigateToPatient(row.original.id)
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
      isEditModalOpen.value = !isEditModalOpen.value
      selectedPatientData.value = patient
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
  
      definePageMeta({
          colorMode: "light",
      });
  }
  
  // Computed properties for statistics
  const activePatients = computed(() => 
    patientsData.value.filter(p => !p.discharged).length
  )
  
  const completedTreatments = computed(() => 
    patientsData.value.filter(p => p.discharged).length
  )
  
  const criticalCases = computed(() => 
    patientsData.value.filter(p => p.critical).length
  )
  
  const avgTreatmentDuration = computed(() => '14.5')
  const successRate = computed(() => '87')
  const commonConditions = computed(() => ['Diabetes', 'Hypertension', 'COPD'])
  
  const medicalGuidelines = [
    { id: 1, title: 'Standard Treatment Protocols', url: '#' },
    { id: 2, title: 'Patient Care Guidelines', url: '#' },
    { id: 3, title: 'Emergency Response Procedures', url: '#' },
    { id: 4, title: 'Medical Documentation Best Practices', url: '#' }
  ]
  
  // New function for quick filters
  function applyQuickFilter(filterValue: string) {
    switch (filterValue) {
      case 'critical':
        searchQuery.value = 'critical'
        break
      case 'recent':
        // Filter for recently updated patients
        break
      case 'longterm':
        // Filter for long-term care patients
        break
      case 'new':
        // Filter for new patients
        break
    }
  }
  </script>
  