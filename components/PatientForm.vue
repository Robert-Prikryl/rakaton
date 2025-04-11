<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'

const props = defineProps<{
  initialData?: {
    name?: string
    email?: string
    phone?: string
    dateOfBirth?: string
  } | null
}>()

const schema = v.object({
  name: v.string([v.minLength(1, 'Name is required')]),
  email: v.pipe(v.string(), v.email('Invalid email')),
  phone: v.string([v.minLength(9, 'Invalid phone number')]),
  dateOfBirth: v.string([v.minLength(1, 'Date of birth is required')])
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
  try {
    toast.add({ 
      title: 'Success', 
      description: 'Patient data saved successfully', 
      color: 'success' 
    })
    emit('submit', event.data)
  } catch (error) {
    toast.add({ 
      title: 'Error', 
      description: 'Failed to save patient data', 
      color: 'error' 
    })
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Name" name="name">
      <UInput v-model="state.name" />
    </UFormField>

    <UFormField label="Email" name="email">
      <UInput v-model="state.email" type="email" />
    </UFormField>

    <UFormField label="Phone" name="phone">
      <UInput v-model="state.phone" type="tel" />
    </UFormField>

    <UFormField label="Date of Birth" name="dateOfBirth">
      <UInput v-model="state.dateOfBirth" type="date" />
    </UFormField>

    <div class="flex justify-end gap-2">
      <UButton type="submit" color="primary" variant="solid">
        {{ props.initialData ? 'Update' : 'Create' }}
      </UButton>
    </div>
  </UForm>
</template> 