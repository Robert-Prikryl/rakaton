<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'
import { defineEmits, reactive, ref, watch, computed } from 'vue'
import { useDoctorStore } from '@/stores/doctorStore'
import type { Doctor } from '@/types/doctor'
import { seedDoctors } from '@/seeders/doctorSeeder'
import { useMeetingStore } from '~/stores/meetingStore'
import { de, id, tr } from '@nuxt/ui/runtime/locale/index.js'
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
  id: '',
  startDateTime: '',
  teamName: '',
  location: '',
  notificationHours: 12,
  notes: '',
  description: '',
  teamMembers: <TeamMember[]>[]
})


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

async function saveTemplate() {
  // Use the state directly if you are saving the template without submitting
  const { startDateTime, teamName, location, notificationHours, notes, description } = state;

  // Check if required fields are present
  if (!startDateTime || !location || notificationHours === undefined) {
    console.error('Missing required fields');
    return;
  }

  const lastMeeting = meetingStore.meetings[meetingStore.meetings.length - 1]
  const newId = lastMeeting ? String(Number(lastMeeting.id) + 1) : '1'
  // Save the template logic here (without scheduling a meeting)
  meetingStore.addMeeting({
    id: String(newId),  // Use the last meeting index for a unique ID
    date: new Date(startDateTime), // Date when the template will be used
    name: teamName ?? '',
    place: location,
    notification: notificationHours,
    notes: notes ?? '',
    description: description ?? '',
    doctors: state.teamMembers,
    isTeplate: true, // Mark this as a template
    patientRecords: [] // Empty patient records as it's a template
  });

  console.log('Template saved:', state);
}

function selectTemplate(template: any) {
  state.id = template.id;
  state.startDateTime = template.date.toISOString().slice(0, 16); // Format to datetime-local
  state.teamName = template.name;
  state.location = template.place;
  state.notificationHours = template.notification;
  state.notes = template.notes;
  state.description = template.description;
  state.teamMembers = template.doctors; // Prefill the team members
}

const templateOptions = computed(() =>
  meetingStore.meetings
    .filter(m => m.isTeplate)
    .map((m, index) => ({
      label: m.name || `Šablona ${index + 1}`,
      value: m
    }))
  )

  const selectedTemplate = ref(null)

  watch(selectedTemplate, (template) => {
    if (template) {
      selectTemplate(template)
    }
  })

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Check if form data exists
  if (!event.data) {
    console.error('Form data is undefined');
    return;
  }

  
  const lastMeeting = meetingStore.meetings[meetingStore.meetings.length - 1]
  const newId = lastMeeting ? String(Number(lastMeeting.id) + 1) : '1'

  // Extract data from the form
  const { startDateTime, teamName, location, notificationHours, notes, description } = event.data;

  // Ensure required fields
  if (!startDateTime || !location || notificationHours === undefined) {
    console.error('Missing required fields');
    return;
  }

    // Proceed to schedule the meeting (add the actual meeting, not just a template)
  meetingStore.addMeeting({
    id: String(newId), // Unique ID
    date: new Date(startDateTime),
    name: teamName ?? '',
    place: location,
    notification: notificationHours,
    notes: notes ?? '',
    description: description ?? '',
    doctors: state.teamMembers,
    isTeplate: false, // Mark this as a scheduled meeting, not a template
    patientRecords: [] // Provide patient records or leave it as an empty array
  });

  console.log('MDT Team scheduled:', event.data);
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
  <UForm :schema="schema" :state="state" class="space-y-6 pt-6" @submit="onSubmit" @submitTemplate="saveTemplate">
    <!-- Basic Information -->
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">Základní informace</h3>
          <USelect
            v-model="selectedTemplate"
            :items="templateOptions"
            placeholder="Vyberte šablonu"
            class="w-64"
            option-attribute="label"
            value-attribute="value"
          />
        </div>
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

      <!-- Create MDT Team Button -->
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