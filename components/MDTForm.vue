<template>
    <div class="mt-4 p-4 border rounded shadow">
      <h2 class="text-lg font-semibold mb-2">MDT Team Form for {{ modelValue }}</h2>
      <form @submit.prevent="submitForm">
        <!-- Form content as per the original code -->
        <!-- Team Type Selection -->
        <div class="mb-2">
          <label class="block mb-1">Team Type</label>
          <select v-model="mdtForm.teamName" class="w-full border p-2 rounded">
            <option value="ORL">ORL</option>
            <option value="Horní GIT">Horní GIT</option>
            <option value="Hrudní">Hrudní</option>
            <option value="Mammární">Mammární</option>
            <option value="Plicní">Plicní</option>
            <option value="Urologický">Urologický</option>
            <option value="Neurologický">Neurologický</option>
            <option value="Sarcomaboard">Sarcomaboard</option>
            <option value="Onkogynekologický">Onkogynekologický</option>
            <option value="Dolní GIT">Dolní GIT</option>
          </select>
        </div>
        <!-- Other form fields go here... -->
        <!-- Submit Button -->
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save MDT Record
        </button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { shallowRef } from 'vue';
  
  const mdtForm = shallowRef({
    teamName: '',
    meetingPlace: '',
    teamMembers: [{ lastName: '', firstName: '', email: '', phone: '', specialty: '', note: '' }],
    inviteTimeBefore: 12,
    extraFields: ['', '', '', '', '', '', '', '', '', ''],
    epikrisis: '',
    relevantExaminations: '',
    mdtQuestion: '',
    mdtQuestionTarget: '',
    note: ''
  });
  
  const modelValue = shallowRef(new Date());  // You can pass this down from the parent component
  
  function submitForm() {
    // Process and save the MDT form data
    console.log('MDT Form submitted:', mdtForm.value);
  }
  </script>
  
  <style scoped>
  /* Add styles specific to the form */
  </style>
  