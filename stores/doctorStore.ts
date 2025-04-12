import { defineStore } from "pinia";
import type { Doctor } from "@/types/doctor";

// stores should be named 'use*Store'
export const useDoctorStore = defineStore("doctor", () => {
  /** STATE */
  const activeDoctor = ref<Doctor | null>(null);
  const doctors = ref<Doctor[]>([]);

  /** GETTERS - computed properties on state, do not actually modify it but can return it in a mutated way (like array.reverse()) without actually changing the original state */
  const getDoctorById = (id: string) => {
    return doctors.value.find(doctor => doctor.id === id);
  }
  

  /** ACTIONS - business logic, fetching, async calls, etc. */
  function setActiveDoctor(id: string) {
    activeDoctor.value = doctors.value.find(doctor => doctor.id === id) || null;
  }

  function addDoctor(doctor: Doctor) {
    doctors.value.push(doctor);
  }

  // Everything we want to use in the components needs to be returned
  /** RETURNS */
  return {
    /** STATE */
    activeDoctor,
    doctors,

    /** GETTERS */
    getDoctorById,
    /** ACTIONS */
    setActiveDoctor,
    addDoctor,
  };
});
