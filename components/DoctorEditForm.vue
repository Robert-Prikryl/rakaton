<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'

const props = defineProps<{
  initialData?: {
    name?: string
    email?: string
    phone?: string
    dateOfBirth?: string
    specialization?: string
  } | null
}>()

const schema = v.object({
  name: v.string([v.minLength(1, 'Jméno je povinné')]),
  email: v.pipe(v.string(), v.email('Neplatný formát emailu')),
  phone: v.string([v.minLength(9, 'Neplatné telefonní číslo')]),
  dateOfBirth: v.string([v.minLength(1, 'Datum narození je povinné')])
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  name: props.initialData?.name || '',
  email: props.initialData?.email || '',
  phone: props.initialData?.phone || '',
  dateOfBirth: props.initialData?.dateOfBirth || ''
})

const emit = defineEmits(['submit'])

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
    console.log('event', event)
  try {
    console.log('event.data', event.data)
    toast.add({ 
      title: 'Úspěch', 
      description: 'Data pacienta byla úspěšně uložena', 
      color: 'success' 
    })
    emit('submit', event.data)
  } catch (error) {
    toast.add({ 
      title: 'Chyba', 
      description: 'Nepodařilo se uložit data pacienta', 
      color: 'error' 
    })
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Jméno" name="name">
      <UInput class="w-full" v-model="state.name" type="text" placeholder="Zadejte jméno" />
    </UFormField>

    <UFormField label="Příjmení" name="surname">
      <UInput class="w-full" v-model="state.surname" type="text" placeholder="Zadejte příjmení" />
    </UFormField>

    <UFormField label="Pohlaví" name="gender">
      <UInput class="w-full" v-model="state.gender" type="text" placeholder="Zadejte pohlaví" />
    </UFormField>

    <UFormField label="Datum narození" name="dateOfBirth">
      <UInput class="w-full" v-model="state.dateOfBirth" type="date" />
    </UFormField>

    <UFormField label="AIS Id" name="aisId">
      <UInput class="w-full" v-model="state.aisId" type="text" placeholder="Zadejte AIS Id" />
    </UFormField>

    <div class="flex justify-end gap-2">
      <UButton type="submit" color="primary" variant="solid">
        {{ props.initialData ? 'Aktualizovat' : 'Vytvořit' }}
      </UButton>
    </div>
  </UForm>
</template> 