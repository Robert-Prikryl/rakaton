<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'
import { defineEmits } from 'vue'

const emit = defineEmits()
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
  teamName: v.optional(v.string()),
  location: v.string('Místo setkání je povinné'),
  notificationHours: v.number('Musí být alespoň 1 hodina'),
  notes: v.optional(v.string()),
  teamMembers: v.optional(v.object({
    lastName: v.optional(v.string()),
    firstName: v.optional(v.string()),
    email: v.pipe(v.optional(v.string()), v.optional(v.string())),
    phone: v.optional(v.string()),
    specialization: v.optional(v.string()),
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
  //toast.add({ title: 'Úspěch', description: 'MDT tým byl vytvořen.', color: 'success' })
  emit('submitDate', event.data.startDateTime)
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
function searchDoctors(query: string) {
  if (!query) return []
  const lowerQuery = query.toLowerCase().trim()
  return doctorsDatabase.filter(doctor => {
    const searchString = `${doctor.lastName} ${doctor.firstName} ${doctor.specialization}`.toLowerCase()
    return searchString.includes(lowerQuery)
  })
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
const searchQuery = ref('')

// Function to handle search input
function handleSearchInput(value: string, index: number) {
  searchQuery.value = value
  searchResults.value = searchDoctors(value)
}

// Function to get display value for selected doctor
function getDisplayValue(index: number): DoctorItem | undefined {
  const member = state.teamMembers[index]
  if (!member.lastName && !member.firstName) return undefined
  return {
    lastName: member.lastName,
    firstName: member.firstName,
    email: member.email,
    phone: member.phone,
    specialization: member.specialization
  }
}

// Function to get search value
function getSearchValue(index: number): string {
  const member = state.teamMembers[index]
  return `${member.lastName} ${member.firstName}`.trim()
}

// Type for doctor item
type DoctorItem = {
  lastName: string
  firstName: string
  email: string
  phone: string
  specialization: string
}

// Function to get current doctor item
function getCurrentDoctorItem(index: number): DoctorItem {
  return {
    lastName: state.teamMembers[index].lastName,
    firstName: state.teamMembers[index].firstName,
    email: state.teamMembers[index].email,
    phone: state.teamMembers[index].phone,
    specialization: state.teamMembers[index].specialization
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-6 pt-10" @submit="onSubmit">
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

          <div class="grid grid-cols-1 gap-4">
            <UFormField label="Vyhledat lékaře" :name="`teamMembers.${index}.search`">
              <UInputMenu
                :model-value="getDisplayValue(index)"
                :items="searchResults"
                :search="getSearchValue(index)"
                @update:search="(value: string) => handleSearchInput(value, index)"
                @select="(doctor: DoctorItem) => handleDoctorSelect(doctor, index)"
                class="w-full"
                placeholder="Zadejte jméno nebo specializaci lékaře"
                :loading="false"
                :searchable="true"
              >
                <template #item="{ item }">
                  <div class="flex items-center gap-2">
                    <div>
                      <div class="font-medium">{{ item.lastName }} {{ item.firstName }}</div>
                      <div class="text-sm text-gray-500">{{ item.specialization }}</div>
                      <div class="text-sm text-gray-500">{{ item.email }}</div>
                    </div>
                  </div>
                </template>
              </UInputMenu>
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

