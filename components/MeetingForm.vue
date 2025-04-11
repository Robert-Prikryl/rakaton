<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'

// Mock database of doctors
const doctorsDatabase = [
  {
    lastName: 'Novotný',
    firstName: 'Jan',
    email: 'jan.novotny@nemocnice.cz',
    phone: '+420 777 123 456',
    specialization: 'Onkologie'
  },
  {
    lastName: 'Svobodová',
    firstName: 'Marie',
    email: 'marie.svobodova@nemocnice.cz',
    phone: '+420 777 234 567',
    specialization: 'Chirurgie'
  },
  {
    lastName: 'Dvořák',
    firstName: 'Petr',
    email: 'petr.dvorak@nemocnice.cz',
    phone: '+420 777 345 678',
    specialization: 'Radiologie'
  },
  {
    lastName: 'Černá',
    firstName: 'Jana',
    email: 'jana.cerna@nemocnice.cz',
    phone: '+420 777 456 789',
    specialization: 'Neurologie'
  },
  {
    lastName: 'Procházka',
    firstName: 'Tomáš',
    email: 'tomas.prochazka@nemocnice.cz',
    phone: '+420 777 567 890',
    specialization: 'Urologie'
  },
  {
    lastName: 'Kučerová',
    firstName: 'Eva',
    email: 'eva.kucerova@nemocnice.cz',
    phone: '+420 777 678 901',
    specialization: 'Onkologie'
  },
  {
    lastName: 'Veselý',
    firstName: 'Martin',
    email: 'martin.vesely@nemocnice.cz',
    phone: '+420 777 789 012',
    specialization: 'Pneumologie'
  },
  {
    lastName: 'Horáková',
    firstName: 'Lucie',
    email: 'lucie.horakova@nemocnice.cz',
    phone: '+420 777 890 123',
    specialization: 'Chirurgie'
  }
]

const teamTypes = [
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
]

// Form schema with validation
const schema = v.object({
  startDateTime: v.string('Datum a čas začátku je povinný'),
  teamName: v.string('Název týmu je povinný'),
  location: v.string('Místo setkání je povinné'),
  notificationHours: v.number('Musí být alespoň 1 hodina'),
  notes: v.optional(v.string()),
  teamMembers: v.array(v.object({
    lastName: v.string('Příjmení je povinné'),
    firstName: v.string('Jméno je povinné'),
    email: v.pipe(v.string('Email je povinný'), v.email('Neplatný formát emailu')),
    phone: v.string('Telefon je povinný'),
    specialization: v.string('Odbornost je povinná'),
    note: v.optional(v.string())
  }))
})

type Schema = v.InferOutput<typeof schema>

// Form state
const state = reactive({
  startDateTime: '',
  teamName: '',
  location: '',
  notificationHours: 12,
  notes: '',
  teamMembers: [{
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    specialization: '',
    note: ''
  }]
})

// Handle form submission
const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Úspěch', description: 'MDT tým byl vytvořen.', color: 'success' })
  console.log(event.data)
}

// Add/remove team members
function addTeamMember() {
  state.teamMembers.push({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    specialization: '',
    note: ''
  })
}

function removeTeamMember(index: number) {
  if (state.teamMembers.length > 1) {
    state.teamMembers.splice(index, 1)
  }
}

// Function to search doctors
function searchDoctors(query: string, field: 'lastName' | 'firstName' | 'specialization') {
  if (!query) return []
  const lowerQuery = query.toLowerCase()
  return doctorsDatabase.filter(doctor => 
    doctor[field].toLowerCase().includes(lowerQuery)
  )
}

// Function to handle doctor selection
function handleDoctorSelect(doctor: typeof doctorsDatabase[0], index: number) {
  state.teamMembers[index] = {
    ...state.teamMembers[index],
    ...doctor,
    note: state.teamMembers[index].note // Preserve existing note
  }
}

// Reactive search results
const searchResults = ref<typeof doctorsDatabase>([])
const activeSearchField = ref<{ index: number, field: 'lastName' | 'firstName' | 'specialization' } | null>(null)

// Function to handle input changes
function handleSearchInput(value: string, index: number, field: 'lastName' | 'firstName' | 'specialization') {
  activeSearchField.value = { index, field }
  searchResults.value = searchDoctors(value, field)
}

// Function to handle manual input
function handleManualInput(value: string | number, index: number, field: 'lastName' | 'firstName' | 'specialization') {
  const stringValue = String(value)
  state.teamMembers[index][field] = stringValue
  handleSearchInput(stringValue, index, field)
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
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
            :options="teamTypes"
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
          <UButton
            color="primary"
            variant="soft"
            icon="i-heroicons-plus"
            @click="addTeamMember"
          >
            Přidat člena
          </UButton>
        </div>
      </template>

      <div v-for="(member, index) in state.teamMembers" :key="index" class="space-y-4">
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-lg font-medium">Člen {{ index + 1 }}</h4>
            <UButton
              v-if="state.teamMembers.length > 1"
              color="error"
              variant="soft"
              icon="i-heroicons-trash"
              @click="removeTeamMember(index)"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Příjmení" :name="`teamMembers.${index}.lastName`">
              <div class="relative">
                <UInput 
                  v-model="member.lastName" 
                  class="w-full"
                  @update:model-value="(value) => handleManualInput(value, index, 'lastName')"
                />
                <div v-if="activeSearchField?.index === index && activeSearchField?.field === 'lastName' && searchResults.length > 0"
                     class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
                  <div v-for="doctor in searchResults" 
                       :key="doctor.email"
                       class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                       @click="handleDoctorSelect(doctor, index)">
                    {{ doctor.lastName }} {{ doctor.firstName }} - {{ doctor.specialization }}
                  </div>
                </div>
              </div>
            </UFormField>

            <UFormField label="Jméno" :name="`teamMembers.${index}.firstName`">
              <div class="relative">
                <UInput 
                  v-model="member.firstName" 
                  class="w-full"
                  @update:model-value="(value) => handleManualInput(value, index, 'firstName')"
                />
                <div v-if="activeSearchField?.index === index && activeSearchField?.field === 'firstName' && searchResults.length > 0"
                     class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
                  <div v-for="doctor in searchResults" 
                       :key="doctor.email"
                       class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                       @click="handleDoctorSelect(doctor, index)">
                    {{ doctor.lastName }} {{ doctor.firstName }} - {{ doctor.specialization }}
                  </div>
                </div>
              </div>
            </UFormField>

            <UFormField label="Email" :name="`teamMembers.${index}.email`">
              <UInput v-model="member.email" type="email" class="w-full" />
            </UFormField>

            <UFormField label="Telefon" :name="`teamMembers.${index}.phone`">
              <UInput v-model="member.phone" type="tel" class="w-full" />
            </UFormField>

            <UFormField label="Odbornost" :name="`teamMembers.${index}.specialization`">
              <div class="relative">
                <UInput 
                  v-model="member.specialization" 
                  class="w-full"
                  @input="handleSearchInput($event, index, 'specialization')"
                />
                <div v-if="activeSearchField?.index === index && activeSearchField?.field === 'specialization' && searchResults.length > 0"
                     class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
                  <div v-for="doctor in searchResults" 
                       :key="doctor.email"
                       class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                       @click="handleDoctorSelect(doctor, index)">
                    {{ doctor.lastName }} {{ doctor.firstName }} - {{ doctor.specialization }}
                  </div>
                </div>
              </div>
            </UFormField>

            <UFormField label="Poznámka (Volitelné)" :name="`teamMembers.${index}.note`">
              <UTextarea v-model="member.note" :rows="2" class="w-full" />
            </UFormField>
          </div>
        </div>

        <UDivider v-if="index < state.teamMembers.length - 1" class="my-6" />
      </div>
    </UCard>

    <!-- Submit Button -->
    <div class="flex justify-end">
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

