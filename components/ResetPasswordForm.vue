<template>
    <div>
      <div class="p-4">
        <template v-if="!newPassword">
          <p class="text-gray-600">Opravdu chcete resetovat heslo pro doktora {{ selectedDoctorData.firstname }} {{ selectedDoctorData.surname }}?</p>
          <!-- <UButton
            color="red"
            variant="solid"
            icon="i-heroicons-arrow-path"
            @click="generatePassword"
          >
            Resetovat
          </UButton> -->
        </template>
        
        <template v-else>
          <div class="space-y-4">
            <p class="text-gray-600">Nové heslo bylo vygenerováno:</p>
            <div class="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
              <span class="font-mono">{{ newPassword }}</span>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-clipboard"
                @click="copyPassword"
              />
            </div>
            <p class="text-sm text-gray-500">Nezapomeňte si heslo uložit!</p>
          </div>
        </template>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <UButton
          color="gray"
          variant="soft"
          @click="$emit('close')"
        >
          Zrušit
        </UButton>
        <UButton
          :disabled="is_password_generated"
          color="red"
          variant="solid"
          icon="i-heroicons-arrow-path"
          @click="generatePassword"
        >
          Resetovat
        </UButton>
      </div>
    </div>
  </template>
  
  <script setup>
  const newPassword = ref('')
  let is_password_generated = ref(false)
  const toast = useToast()

  function generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    newPassword.value = password
    is_password_generated.value = true
  }

  async function copyPassword() {
    await navigator.clipboard.writeText(newPassword.value)
    toast.add({
      title: 'Zkopírováno',
      description: 'Heslo bylo zkopírováno do schránky',
      color: 'green',
      icon: 'i-heroicons-check'
    })
  }

  const props = defineProps({
    selectedDoctorData: {
      type: Object,
      required: true
    }
  })

  defineEmits(['close', 'confirm'])
  </script>
  
  <style></style>