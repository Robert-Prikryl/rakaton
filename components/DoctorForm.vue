<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'

const props = defineProps<{
  initialData?: {
    surname?: string
    firstname?: string
    email?: string
    phone?: string
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
  surname: props.initialData?.surname || '',
  firstname: props.initialData?.firstname || '',
  email: props.initialData?.email || '',
  phone: props.initialData?.phone || '',
  specialization: props.initialData?.specialization || ''
})

console.log('props.initialData', state)

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
    <UFormField label="Jméno" name="firstname">
      <UInput class="w-full" v-model="state.firstname" type="text" placeholder="Zadejte jméno" />
    </UFormField>

    <UFormField label="Příjmení" name="surname">
      <UInput class="w-full" v-model="state.surname" type="text" placeholder="Zadejte příjmení" />
    </UFormField>

    <UFormField label="Email" name="email">
      <UInput class="w-full" v-model="state.email" type="email" placeholder="Zadejte email" />
    </UFormField>

    <UFormField label="Telefon" name="phone">
      <UInput class="w-full" v-model="state.phone" type="text" placeholder="Zadejte telefon" />
    </UFormField>

    <UFormField label="Specializace" name="specialization">
      <UInput class="w-full" v-model="state.specialization" type="text" placeholder="Zadejte specializaci" />
    </UFormField>

    <div class="flex justify-end gap-2">
      <UButton type="submit" color="primary" variant="solid">
        {{ props.initialData ? 'Aktualizovat' : 'Vytvořit' }}
      </UButton>
    </div>
  </UForm>
</template> 