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
                        <NuxtLink 
                            to="/" 
                            class="w-5 h-5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 group"
                        >
                            <UIcon 
                                name="i-heroicons-sparkles" 
                                class="w-3 h-3 text-white group-hover:scale-110 transition-transform duration-300"
                            />
                        </NuxtLink>
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

definePageMeta({
  colorMode: "light",
});
</script>