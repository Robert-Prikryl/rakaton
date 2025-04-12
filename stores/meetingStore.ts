import { defineStore } from "pinia";
import type { Meeting } from "~/types/meeeting";
import type { PatientRecord } from "~/types/patient";
// stores should be named 'use*Store'
export const useMeetingStore = defineStore("meeting", () => {
  /** STATE */
  const activeMeeting = ref<Meeting | null>(null);
  const meetings = ref<Meeting[]>([]);

  /** GETTERS - computed properties on state, do not actually modify it but can return it in a mutated way (like array.reverse()) without actually changing the original state */
  const getMeetingById = (id: string) => {
    return meetings.value.find(meeting => meeting.id === id);
  }
  

  /** ACTIONS - business logic, fetching, async calls, etc. */
  function setActiveMeeting(id: string) {
    activeMeeting.value = meetings.value.find(meeting => meeting.id === id) || null;
  }

  function addMeeting(meeting: Meeting) {
    meetings.value.push(meeting);
  }

  function addPatientRecord(patientRecord: PatientRecord) {
    activeMeeting.value?.patientRecords.push(patientRecord);
  }

  // Everything we want to use in the components needs to be returned
  /** RETURNS */
  return {
    /** STATE */
    activeMeeting,
    meetings,

    /** GETTERS */
    getMeetingById,
    /** ACTIONS */
    setActiveMeeting,
    addMeeting,
    addPatientRecord
  };
});
