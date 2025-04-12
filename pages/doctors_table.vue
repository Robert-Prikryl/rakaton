<template>
    <div class="container mx-auto p-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Doktoři</h1>
        
        <!-- Search Bar -->
      <div class="w-auto flex">

      <UModal title="Vytvořit nového doktora">
          <UButton label="Vytvořit nového doktora" class="flex gap-6 mr-4" color="primary" variant="subtle" />

          <template #body>
              <DoctorForm @submit="handleSubmit" />
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
          :data="doctorsData"
          :search="searchQuery"
          :sort="{ column: 'name', direction: 'asc' }"
        />
      </ClientOnly>

      <!-- Delete Confirmation Modal -->
      <UModal v-model:open="isDeleteModalOpen">
          <UButton label="Vymazat doktora" id="delete-doctor-button" class="flex gap-6 mr-4 hidden" color="primary" variant="subtle" />
          <template #header>
              <h3 class="text-xl font-semibold">Smazat doktora</h3>
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
              <DoctorForm @submit="handleSubmit" :initial-data="selectedDoctorData" />
          </template>
      </UModal>
    </div>
  </template>
  
  <script setup lang="ts">
  import { type Doctor } from '~/types/doctor'
  import { seedDoctors } from '~/seeders/doctorSeeder'
  import { h, resolveComponent } from 'vue'
  import type { TableColumn } from '@nuxt/ui'

  const searchQuery = ref('')
  const isModalOpen = ref(false)
  const isEditing = ref(false)
  const doctorsData = ref<Doctor[]>([])
  let selectedDoctorData = ref<Doctor | null>(null)
  let simplifiedDoctors = ref<Doctor[]>([])
  const router = useRouter()
  const isDeleteModalOpen = ref(false)
  const isEditModalOpen = ref(false)
  const doctorToDelete = ref<string | null>(null)

  onMounted(() => {
      // Create a new instance of the store to ensure correct hydration
      const doctorStore = useDoctorStore();
      
      // Execute seedPatients without arguments as it creates its own store instance
      seedDoctors();
      
      // Use import.meta.client to ensure we only access localStorage on client-side
      if (import.meta.client) {
          // Get patients data from the store
          doctorsData.value = doctorStore.doctors;
          console.log('Loaded doctors:', doctorsData.value);
      }
  });

  // Table columns configuration
  const columns: TableColumn<Doctor>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => `#${row.getValue('id')}`
    },
    {
      accessorKey: 'firstname',
      header: 'First Name',
      cell: ({ row }) => row.getValue('firstname')
    },
    {
      accessorKey: 'surname',
      header: 'Last Name',
      cell: ({ row }) => row.getValue('surname')
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => row.getValue('email')
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => row.getValue('phone')
    },
    {
      accessorKey: 'specialization',
      header: 'Specialization',
      cell: ({ row }) => row.getValue('specialization')
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
            onClick: () => navigateToDoctor(row.original.id)
          }),
          h(resolveComponent('UButton'), {
            color: 'primary',
            variant: 'ghost',
            icon: 'i-heroicons-pencil-square',
            size: 'xs',
            onClick: () => editDoctor(row.original)
          }),
          h(resolveComponent('UButton'), {
            color: 'error',
            variant: 'ghost',
            icon: 'i-heroicons-trash',
            size: 'xs',
            onClick: () => deleteDoctor(row.original.id)
          })
        ])
      }
    }
  ]

  function handleClose() {
      isDeleteModalOpen.value = !isDeleteModalOpen.value
      isDeleteModalOpen.value = false
      doctorToDelete.value = null
  }

  // Modal functions
  function openAddModal() {
    doctorsData.value = null
    isEditing.value = false
    isModalOpen.value = true
  }

  function closeModal() {
    isModalOpen.value = false
    isEditing.value = false
    doctorsData.value = null
  }

  function editDoctor(doctor: Doctor) {
    isEditModalOpen.value = !isEditModalOpen.value
    selectedDoctorData.value = doctor
  }

  function deleteDoctor(id: string) {
    doctorToDelete.value = id
    isDeleteModalOpen.value = true
    document.getElementById('delete-doctor-button')?.click()
  }

  function confirmDelete() {
    if (doctorToDelete.value) {
      doctorsData.value = doctorsData.value.filter(d => d.id !== doctorToDelete.value)
      
      const toast = useToast()
      toast.add({
        title: 'Úspěch',
        description: 'Doktor byl úspěšně smazán',
        color: 'green',
        icon: 'i-heroicons-check-circle'
      })
      
      isDeleteModalOpen.value = false
      doctorToDelete.value = null
    }
  }

  function navigateToDoctor(id: string) {
    router.push(`/doctor?id=${id}`)
    // Alternative format if you prefer cleaner URLs:
    // router.push(`/doctor/${id}`)
  }

  function handleSubmit(data: Doctor) {
      
      doctorStore.doctors.push(data)
      doctorsData.value.push(data)
      console.log('doctorsData', doctorsData.value)

  //   if (isEditing.value) {
  //     // Update existing patient
  //     const index = patientsData.value.findIndex(p => p.id === patientsData.value?.id)
  //     if (index !== -1) {
  //         patientsData.value[index] = { ...patientsData.value[index], ...data }
  //     }
  //   } else {
  //     // Add new patient
  //     patientsData.value.push({
  //       id: Date.now(),
  //       ...data
  //     })
  //   }
    
    // Close modal and reset state
    closeModal()
    definePageMeta({
      colorMode: "light",
      });
    // Show success toast
    const toast = useToast()
    toast.add({
      title: 'Success',
      description: isEditing.value ? 'Doctor updated successfully' : 'Doctor added successfully',
      color: 'success'
    })
  }
  </script>