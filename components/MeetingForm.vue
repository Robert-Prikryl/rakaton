<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'
import { defineEmits, reactive, ref, watch, computed } from 'vue'
import { useDoctorStore } from '@/stores/doctorStore'
import type { Doctor } from '@/types/doctor'
import { seedDoctors } from '@/seeders/doctorSeeder'
const emit = defineEmits()
// Mock database of doctors
const doctorStore = useDoctorStore()
const value = ref<Doctor | null>(null)

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
  teamMembers: v.optional(v.object({
    surname: v.optional(v.string()),
    firstname: v.optional(v.string()),
    email: v.pipe(v.optional(v.string()), v.optional(v.string())),
    phone: v.optional(v.string()),
    specialization: v.optional(v.string())
  }))
})

type Schema = v.InferOutput<typeof schema>

// Add this type definition
type TeamMember = {
  surname: string
  firstname: string
  email: string
  phone: string
  specialization: string
}

// Update the state type
const state = reactive({
  startDateTime: '',
  teamName: '',
  location: '',
  notificationHours: 12,
  notes: '',
  teamMembers: <TeamMember[]>[]
})

// Handle form submission
async function onSubmit(event: FormSubmitEvent<Schema>) {
  //toast.add({ title: 'Úspěch', description: 'MDT tým byl vytvořen.', color: 'success' })
  emit('submitDate', event.data.startDateTime)
  console.log(event.data)
}

// Update the addTeamMember function
function addTeamMember(doctor: Doctor) {
  state.teamMembers.push({
    surname: doctor.surname,
    firstname: doctor.firstname,
    email: doctor.email,
    phone: doctor.phone,
    specialization: doctor.specialization
  })
}

function removeTeamMember(index: number) {
  if (state.teamMembers.length > 1) {
    state.teamMembers.splice(index, 1)
  }
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

