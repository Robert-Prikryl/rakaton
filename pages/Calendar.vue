<template>
    <div>
      <SarcomaCalendar />
      <MeetingForm />
    </div>
  </template>
  
  <script>
  import SarcomaCalendar from '@/components/SarcomaCalendar.vue';
  import MeetingForm from '@/components/MeetingForm.vue'; 

  definePageMeta({
    colorMode: "light",
  });
  
  export default {
    components: {
      SarcomaCalendar,
      MeetingForm,  // Register it here
    },
  };
  </script>
  
  <style>
  /* Your page styles */
  </style>
  