<template>
  <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
    <UAvatar
      :alt="doctor.firstname + ' ' + doctor.surname"
      :text="doctor.firstname[0] + doctor.surname[0]"
    />
    <div>
      <div class="font-medium text-gray-900">
        {{ doctor.firstname }} {{ doctor.surname }}
      </div>
      <div class="text-sm text-gray-500">{{ doctor.specialization }}</div>
      <div class="text-sm text-gray-500 flex items-center gap-2 mt-1">
        <UIcon name="i-heroicons-envelope" class="text-gray-400" />
        {{ doctor.email }}
      </div>
      <div class="text-sm text-gray-500 flex items-center gap-2">
        <UIcon name="i-heroicons-phone" class="text-gray-400" />
        {{ doctor.phone }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Doctor {
  id: string | number;
  firstname: string;
  surname: string;
  specialization: string;
  email: string;
  phone: string;
}

defineProps<{
  doctor: Doctor;
}>();
</script>
