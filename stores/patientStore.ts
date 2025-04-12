import { defineStore } from "pinia";
import type { Patient } from "@/types/patient";

// stores should be named 'use*Store'
export const usePatientStore = defineStore("patient", () => {
  /** STATE */
  const activePatient = ref<Patient | null>(null);
  const patients = ref<Patient[]>([]);

  /** GETTERS - computed properties on state, do not actually modify it but can return it in a mutated way (like array.reverse()) without actually changing the original state */
  const getPatientById = (id: string) => {
    return patients.value.find(patient => patient.id === id);
  }
  

  /** ACTIONS - business logic, fetching, async calls, etc. */
  function setActivePatient(id: string) {
    activePatient.value = patients.value.find(patient => patient.id === id) || null;
  }

  function addPatient(patient: Patient) {
    patients.value.push(patient);
  }

  // Everything we want to use in the components needs to be returned
  /** RETURNS */
  return {
    /** STATE */
    activePatient,
    patients,

    /** GETTERS */
    getPatientById,
    /** ACTIONS */
    setActivePatient,
    addPatient,
  };
});
