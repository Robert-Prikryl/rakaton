import { defineStore } from "pinia";
import type { Record } from "@/types/timeline";

// stores should be named 'use*Store'
export const useRecordsStore = defineStore("records", () => {
  /** STATE */
  const activeRecord = ref<Record | null>(null);
  const records = ref<Record[]>([]);

  /** GETTERS - computed properties on state, do not actually modify it but can return it in a mutated way (like array.reverse()) without actually changing the original state */
  const getRecordById = (id: string) => {
    return records.value.find(record => record.id === id);
  }
  

  /** ACTIONS - business logic, fetching, async calls, etc. */
  function setActiveRecord(id: string) {
    activeRecord.value = records.value.find(record => record.id === id) || null;
  }

  function addRecord(record: Record) {
    records.value.push(record);
  }

  // Everything we want to use in the components needs to be returned
  /** RETURNS */
  return {
    /** STATE */
    activeRecord,
    records,

    /** GETTERS */
    getRecordById,
    /** ACTIONS */
    setActiveRecord,
    addRecord,
  };
});
