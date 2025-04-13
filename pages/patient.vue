<template>
    <div class="border-2 border-gray-300 rounded-lg md:m-8">
        <div class="border-b-2 border-gray-300 px-6 md:px-12 py-4" v-if="patientStore.activePatient">
            <div class="flex flex-col space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                <!-- Left Column -->
                <div class="space-y-4">
                    <div class="flex items-center gap-3">
                        <UIcon name="i-heroicons-user" class="shrink-0" />
                        <p class="text-lg md:text-2xl text-gray-900">
                            {{ patientStore.activePatient?.name + ' ' + patientStore.activePatient?.lastName }}
                        </p>
                        <UModal :title="`Vyhledejte informace o pacientovi ${patientStore.activePatient?.name + ' ' + patientStore.activePatient?.lastName}`">
                            <UButton 
                                class="w-8 h-7 rounded flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
                            >
                                <UIcon 
                                    name="i-heroicons-sparkles" 
                                    class="text-white group-hover:scale-110 transition-transform duration-300"
                                />
                            </UButton>
                            <template #body>
                                <div class="flex flex-col space-y-4">
                                    <div class="flex items-center gap-2 mb-2">
                                        <UIcon 
                                            name="i-heroicons-light-bulb" 
                                            class="w-5 h-5 text-amber-500"
                                        />
                                        <h1 class="text-lg font-semibold text-gray-900">Nápověda</h1>
                                    </div>
                                    
                                    <div class="relative bg-white rounded-xl shadow-sm border border-gray-200">
                                        <UTextarea
                                            v-model="prompt"
                                            placeholder="Zeptejte se na cokoliv ohledně pacienta..."
                                            class="w-full pr-14 resize-none border-0 focus:ring-0 rounded-xl"
                                            :rows="2"
                                            @keydown.enter.prevent="handlePrompt"
                                        />
                                        <UButton
                                            color="primary"
                                            :loading="isLoading"
                                            class="absolute bottom-2.5 right-2.5 rounded-full w-9 h-9 flex items-center justify-center"
                                            @click="handlePrompt"
                                        >
                                            <UIcon 
                                                name="i-heroicons-paper-airplane" 
                                                class="w-4 h-4 -rotate-45"
                                            />
                                        </UButton>
                                    </div>

                                    <!-- Only AI Response -->
                                    <div 
                                        v-if="response"
                                        class="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl shadow-sm border border-purple-100"
                                    >
                                        <div class="flex items-start gap-3">
                                            <div class="shrink-0">
                                                <UAvatar
                                                    src="/ai-avatar.png"
                                                    size="sm"
                                                    class="ring-2 ring-purple-200 ring-offset-2"
                                                />
                                            </div>
                                            <div class="flex-1">
                                                <div class="flex items-center gap-2 mb-1">
                                                    <span class="text-sm font-medium text-purple-900">Informační Asistent</span>
                                                    <span class="text-xs text-purple-500">•</span>
                                                    <span class="text-xs text-purple-500">Rakaton</span>
                                                </div>
                                                <p class="text-sm text-gray-700 leading-relaxed">{{ response }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </UModal>
                        
                    </div>
                    <div class="flex items-center gap-3">
                        <UIcon name="mdi:gender-male-female" class="shrink-0" />
                        <p class="text-sm md:text-lg text-gray-500">
                            {{ patientStore.activePatient?.gender }}
                        </p>
                    </div>
                    <div class="flex items-center gap-3">
                        <UIcon name="material-symbols:calendar-month" class="shrink-0" />
                        <p class="text-sm md:text-lg text-gray-500">
                            {{ formatDate(patientStore.activePatient?.dateOfBirth) }}
                        </p>
                    </div>
                </div>
                
                <!-- Right Column -->
                <div class="space-y-4 flex md:justify-end">
                    <div class="space-y-4 inline-flex flex-col items-start">
                        <div class="flex items-center gap-3">
                            <UIcon name="garden:credit-card-stroke-12" class="shrink-0" />
                            <p class="text-sm md:text-lg text-gray-500">
                                {{ patientStore.activePatient?.insuranceId }}
                            </p>
                        </div>
                        <div class="flex items-center gap-3">
                            <UIcon name="material-symbols:edit-document-sharp" class="shrink-0" />
                            <p class="text-sm md:text-lg text-gray-500">
                                {{ patientStore.activePatient?.birthNumber }}
                            </p>
                        </div>
                        <div class="flex items-center gap-3">
                            <UIcon name="ph:hospital-light" class="shrink-0" />
                            <p class="text-sm md:text-lg text-gray-500">
                                {{ patientStore.activePatient?.aisId }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col md:flex-row gap-4">
                <Timeline class="mt-12 flex-grow"/>
                <TimelineLegend class="flex md:w-6 justify-end flex-col"/>
            </div>
        </div>
        <MeetingReport />
    </div>
</template>

<script setup lang="ts">
import { useRecordsStore } from '@/stores/recordsStore';
import { usePatientStore } from '@/stores/patientStore';
import { seedPatients } from '@/seeders/patientSeeder';
import { pushSeeds } from '@/seeders/recordSeeder';
import { seedMeetings } from '@/seeders/meetingSeeder';
import TimelineLegend from '~/components/TimelineLegend.vue'

const patientStore = usePatientStore();
// onMounted(() => {
//     seedPatients();
//     patientStore.setActivePatient(patientStore.patients[0].id);
//     const recordsStore = useRecordsStore();
//     pushSeeds(recordsStore);
//     seedMeetings();
// });

function formatDate(date: string | undefined) {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  return `${day}.${month}.${year}`;
}

const prompt = ref('')
const isLoading = ref(false)
const response = ref('')

async function handlePrompt() {
  if (!prompt.value.trim()) return

  isLoading.value = true
  try {
    // Simulate AI response - replace with your actual AI implementation
    await new Promise(resolve => setTimeout(resolve, 1000))
    response.value = 'Toto je simulovaná odpověď asistenta. Implementujte vlastní logiku pro zpracování dotazů.'
  } finally {
    isLoading.value = false
  }
}

definePageMeta({
  colorMode: "light",
});
</script>

<style scoped>
.resize-none {
  resize: none;
}

/* Optional: Add smooth transitions */
.rounded-xl {
  transition: all 0.2s ease-in-out;
}

.UTextarea:focus-within {
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}
</style>