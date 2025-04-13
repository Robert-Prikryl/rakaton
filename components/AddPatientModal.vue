<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Nový záznam pacienta</h2>
      <button 
        @click="$emit('close')" 
        class="text-gray-500 hover:text-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="space-y-4">
      <!-- Patient Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Pacient</label
        >
        <select
          v-model="selectedPatient"
          class="form-select w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">Vyberte pacienta</option>
          <option
            v-for="patient in patients"
            :key="patient.id"
            :value="patient"
          >
            {{ patient.name }} {{ patient.lastName }} -
            {{ patient.birthNumber }}
          </option>
        </select>
      </div>

      <!-- PatientRecord specific fields -->
      <div v-if="selectedPatient">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Epikríza</label
          >
          <textarea
            v-model="newRecord.epikriza"
            rows="4"
            class="w-full border border-gray-300 rounded-md p-2"
            placeholder="Zadejte epikrízu"
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Relevantní vyšetření a výkony</label
          >
          <div class="space-y-4">
            <div
              v-for="(modality, index) in newRecord.modality"
              :key="index"
              class="border p-3 rounded-md"
            >
              <div class="flex items-center space-x-2 mb-2">
                <select
                  v-model="modality.type"
                  class="w-1/3 border border-gray-300 rounded-md p-2"
                >
                  <option
                    v-for="type in modalityTypes"
                    :key="type"
                    :value="type"
                  >
                    {{ getModalityTypeLabel(type) }}
                  </option>
                </select>
                <input
                  v-model="modality.date"
                  type="date"
                  class="w-1/3 border border-gray-300 rounded-md p-2"
                />
                <button
                  @click="removeModality(index)"
                  class="text-red-500 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Místo vyšetření</label
                >
                <input
                  v-model="modality.place"
                  type="text"
                  placeholder="Zadejte místo vyšetření"
                  class="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Výsledek</label
                >
                <textarea
                  v-model="modality.results"
                  rows="3"
                  class="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Zadejte výsledek vyšetření"
                ></textarea>
              </div>
            </div>
            <button
              @click="addModality"
              class="flex items-center justify-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#51aca8] hover:bg-[#3d8a86] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#51aca8]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
              Přidat vyšetření
            </button>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Otázky</label
          >
          <div class="space-y-2">
            <div
              v-for="(question, index) in newRecord.questions"
              :key="index"
              class="border p-2 rounded-md"
            >
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Otázka</label
                >
                <textarea
                  v-model="question.question"
                  rows="2"
                  class="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Zadejte otázku"
                ></textarea>
              </div>
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Poznámka</label
                >
                <textarea
                  v-model="question.note"
                  rows="2"
                  class="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Zadejte poznámku"
                ></textarea>
              </div>
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Vyšetřující lékař</label
                >
                <select
                  v-model="question.reciepient"
                  class="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Vyberte lékaře</option>
                  <option
                    v-for="doctor in doctors"
                    :key="doctor.id"
                    :value="doctor"
                  >
                    {{ doctor.firstname }} {{ doctor.surname }} -
                    {{ doctor.specialization }}
                  </option>
                </select>
              </div>
              <button
                @click="removeQuestion(index)"
                class="text-red-500 hover:text-red-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <button
              @click="addQuestion"
              class="flex items-center justify-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#51aca8] hover:bg-[#3d8a86] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#51aca8]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
              Přidat otázku
            </button>
          </div>
        </div>
      </div>

      <button
        @click="createRecord"
        :disabled="!selectedPatient"
        class="bg-[#7ac142] text-white px-4 py-2 rounded-md hover:bg-[#6aad3a] disabled:bg-gray-300"
      >
        Vytvořit záznam
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { usePatientStore } from "@/stores/patientStore";
import { useDoctorStore } from "@/stores/doctorStore";
import type { Patient, PatientRecord } from "@/types/patient";
import type { Doctor } from "@/types/doctor";
import { ModalityType } from "@/types/patient";
import { useMeetingStore } from "@/stores/meetingStore";

const emit = defineEmits(['close']);

const patientStore = usePatientStore();
const doctorStore = useDoctorStore();
const meetingStore = useMeetingStore();
const patients = patientStore.patients;
const doctors = doctorStore.doctors;
const selectedPatient = ref<Patient | null>(null);

// Get all modality types for the select box
const modalityTypes = Object.values(ModalityType);

// Function to get human-readable labels for modality types
const getModalityTypeLabel = (type: ModalityType): string => {
    switch (type) {
        case ModalityType.CT:
            return "CT";
        case ModalityType.MR:
            return "MR";
        case ModalityType.PET_CT:
            return "PET/CT";
        case ModalityType.OTHER:
            return "Iné";
        default:
            return type;
    }
};

// Initialize the new record with default values
const newRecord = ref<PatientRecord>({
    id: "",
    name: "",
    lastName: "",
    gender: "",
    aisId: "",
    insuranceId: "",
    birthNumber: "",
    dateOfBirth: "",
    epikriza: "",
    modality: [],
    questions: [],
});

// Watch for changes in selectedPatient and update newRecord accordingly
watch(selectedPatient, (patient) => {
    if (patient) {
        newRecord.value = {
            ...patient,
            epikriza: "",
            modality: [],
            questions: [],
        };
    }
});

// Function to add a new modality
const addModality = () => {
    newRecord.value.modality.push({
        id: crypto.randomUUID(),
        type: ModalityType.CT,
        date: new Date(),
        place: "",
        results: "",
    });
};

// Function to remove a modality
const removeModality = (index: number) => {
    newRecord.value.modality.splice(index, 1);
};

// Function to add a new question
const addQuestion = () => {
    newRecord.value.questions.push({
        id: crypto.randomUUID(),
        reciepient: {} as Doctor,
        question: "",
        note: "",
        tasks: [],
    });
};

// Function to remove a question
const removeQuestion = (index: number) => {
    newRecord.value.questions.splice(index, 1);
};

const createRecord = () => {
    // Here you can add the logic to save the record
    meetingStore.addPatientRecord(newRecord.value);
};
</script>
