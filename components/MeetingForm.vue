<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'
import { defineEmits, reactive, ref, watch, computed } from 'vue'
import { useDoctorStore } from '@/stores/doctorStore'
import type { Doctor } from '@/types/doctor'
import { seedDoctors } from '@/seeders/doctorSeeder'
import { useMeetingStore } from '~/stores/meetingStore'
import { de, tr } from '@nuxt/ui/runtime/locale/index.js'
const emit = defineEmits()
// Mock database of doctors
const doctorStore = useDoctorStore()
const value = ref<Doctor | null>(null)
const meetingStore = useMeetingStore()

onMounted(() => {
  seedDoctors()
})

const teamTypes = ref([
  'ORL',
  'Horní GIT',
  'Hrudní',
  'Mammární',
  'Plicní',
  'Urologický',
  'Neurologický',
  'Sarcomaboard',
  'Onkogynekologický',
  'Dolní GIT'
]);

// Form schema with validation
const schema = v.object({
  startDateTime: v.string('Datum a čas začátku je povinný'),
  teamName: v.optional(v.string()),
  location: v.string('Místo setkání je povinné'),
  notificationHours: v.number('Musí být alespoň 1 hodina'),
  notes: v.optional(v.string()),
  description: v.optional(v.string()),
  teamMembers: v.optional(v.array(v.object({
    id: v.string('ID je povinné'),
    firstname: v.string('Jméno je povinné'),
    surname: v.string('Příjmení je povinné'),
    email: v.pipe(v.string('Email je povinný'), v.email('Neplatný formát emailu')),
    phone: v.string('Telefonní číslo je povinné'),
    specialization: v.string('Odbornost je povinná'),
    password: v.string('Heslo je povinné'),
    patients: v.array(v.object({})),  // Můžete definovat typ pro Patient, pokud je potřeba
    tasks: v.array(v.object({})),     // Můžete definovat typ pro Task, pokud je potřeba
  })))
})

type Schema = v.InferOutput<typeof schema>

// Add this type definition
type TeamMember = Doctor

// Update the state type
const state = reactive({
  startDateTime: '',
  teamName: '',
  location: '',
  notificationHours: 12,
  notes: '',
  description: '',
  teamMembers: <TeamMember[]>[]
})

// Handle form submission
async function onSubmit(event: FormSubmitEvent<Schema>) {
  //toast.add({ title: 'Úspěch', description: 'MDT tým byl vytvořen.', color: 'success' })
  emit('submitDate', event.data.startDateTime)
  meetingStore.addMeeting({
    id: '', // Provide a unique ID or generate one dynamically
    date: new Date(event.data.startDateTime),
    name: event.data.teamName ?? '',
    place: event.data.location,
    notification: event.data.notificationHours,
    notes: event.data.notes ?? '',
    description: event.data.description ?? '',
    doctors: state.teamMembers,
    isTeplate: false,
    patientRecords: [] // Provide patient records or leave it as an empty array
  })
  console.log(event.data)
}

// Update the addTeamMember function
function addTeamMember(doctor: Doctor) {
  state.teamMembers.push({
    id: doctor.id ?? '',  // Předpokládá, že `doctor.id` existuje
    surname: doctor.surname,
    firstname: doctor.firstname,
    email: doctor.email,
    phone: doctor.phone,
    specialization: doctor.specialization,
    password: doctor.password,  // Předpokládá, že `doctor.password` existuje
    patients: doctor.patients,  // Předpokládá, že `doctor.patients` existuje
    tasks: doctor.tasks         // Předpokládá, že `doctor.tasks` existuje
  })
}

function removeTeamMember(index: number) {
  if (state.teamMembers.length > 1) {
    state.teamMembers.splice(index, 1)
  }
}

async function saveTemplate(event: FormSubmitEvent<Schema>) {
  // Save the template logic here
  meetingStore.addMeeting({
    id: '', // Provide a unique ID or generate one dynamically
    date: new Date(event.data.startDateTime),
    name: event.data.teamName ?? '',
    place: event.data.location,
    notification: event.data.notificationHours,
    notes: event.data.notes ?? '',
    description: event.data.description ?? '',
    doctors: state.teamMembers,
    isTeplate: true,
    patientRecords: [] // Provide patient records or leave it as an empty array
  })
}

// Add watch for value changes
watch(value, (newDoctor) => {
  addTeamMember(newDoctor as Doctor)
})

// Computed property for filtered doctors
const items = computed(() => {
  return doctorStore.doctors
})

</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-6 pt-10" @submit="onSubmit" @submitTemplate="saveTemplate">
    <!-- Basic Information -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Základní informace</h3>
      </template>

      <div class="space-y-4">
        <UFormField label="Datum a čas začátku" name="startDateTime">
          <UInput v-model="state.startDateTime" type="datetime-local" class="w-full" />
        </UFormField>

        <UFormField label="Název týmu" name="teamName">
          <USelect
            v-model="state.teamName"
            :items="teamTypes"
            placeholder="Vyberte typ týmu"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Místo setkání" name="location">
          <UTextarea
            v-model="state.location"
            :rows="2"
            placeholder="Zadejte místo setkání"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Počet hodin před setkáním pro odeslání pozvánky" name="notificationHours">
          <UInput
            v-model="state.notificationHours"
            type="number"
            :min="1"
            :max="72"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Popis" name="description">
          <UTextarea
            v-model="state.description"
            :rows="3"
            placeholder="Zadejte popis"
            class="w-full"
          />
        </UFormField>

        <!-- Notes -->
        <UFormField label="Poznámky" name="notes">
          <UTextarea
            v-model="state.notes"
            :rows="3"
            placeholder="Zadejte poznámky"
            class="w-full"
          />
        </UFormField>
      </div>
    </UCard>

    <!-- Team Members -->
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">Členové týmu</h3>
        </div>
      </template>

      <div class="grid grid-cols-1 gap-4 mb-4">
          <UFormField label="Vyhledat lékaře" :name="`teamMembers.${index}.search`">
            <UInputMenu 
              v-model="value" 
              :items="items"
              value-attribute="id"
            >
              <template #item="{ item }">
                <div class="flex items-center gap-2">
                  <div>
                    <div class="font-medium">{{ item.surname }} {{ item.firstname }}</div>
                    <div class="text-sm text-gray-500">{{ item.specialization }}</div>
                    <div class="text-sm text-gray-500">{{ item.email }}</div>
                  </div>
                </div>
              </template>
            </UInputMenu>
          </UFormField>
        </div>

      <div v-for="(member, index) in state.teamMembers" :key="index" class="space-y-4">
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <DoctorPreview :doctor="member" />
            <UButton
              color="error"
              variant="soft"
              icon="i-heroicons-trash"
              @click="removeTeamMember(index)"
            />
          </div>
          
        </div>

        <UDivider v-if="index < state.teamMembers.length - 1" class="my-6" />
      </div>
    </UCard>

    <!-- Submit Button -->
    <div class="flex justify-end space-x-4">

      <!-- Save Template Button -->
      <UButton
        color="secondary"
        size="lg"
        @click="saveTemplate"
      >
        Uložit šablonu
      </UButton>
      <UButton
        type="submit"
        color="primary"
        size="lg"
      >
        Vytvořit MDT tým
      </UButton>

      
    </div>
  </UForm>
</template>

<style scoped>
.autocomplete-results {
  max-height: 200px;
  overflow-y: auto;
}
</style>