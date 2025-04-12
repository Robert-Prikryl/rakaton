<template>
  <div>
    <div class="p-4">
      <p class="text-gray-600">Opravdu chcete smazat tohoto pacienta? Tuto akci nelze vrátit zpět.</p>
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
        color="red"
        variant="solid"
        icon="i-heroicons-trash"
        @click="$emit('confirm')"
      >
        Smazat
      </UButton>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close', 'confirm'])
</script>

<style></style>