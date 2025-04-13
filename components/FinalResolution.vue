<template>
    <div class="p-4">
        <div v-if="activeMeeting && activeMeeting.patientRecords.length > 0" class="space-y-6">
            <div v-for="patient in activeMeeting.patientRecords" :key="patient.id" class="space-y-4">
                <h2 class="text-xl font-semibold">{{ patient.name }} {{ patient.lastName }}</h2>
                
                <!-- Questions Section -->
                <div v-for="(question, qIndex) in patient.questions" :key="question.id" class="border rounded-lg p-4 bg-gray-50">
                    <div class="space-y-4">
                        <!-- Question Details -->
                        <div>
                            <h3 class="font-medium">Otázka:</h3>
                            <p class="text-gray-700">{{ question.question }}</p>
                            <p class="text-sm text-gray-500">Pro: {{ question.reciepient.firstname }} {{ question.reciepient.surname }}</p>
                        </div>

                        <!-- Result Selection -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Výsledek:</label>
                            <USelect
                                v-model="question.result"
                                :items="resultTypeOptions"
                                placeholder="Vyberte výsledek"
                                class="mt-1"
                            />
                        </div>

                        <!-- Tasks Section -->
                        <div class="space-y-2">
                            <div class="flex justify-between items-center">
                                <h4 class="font-medium">Úkoly:</h4>
                                <UButton
                                    size="xs"
                                    color="primary"
                                    @click="addTask(question)"
                                    icon="i-heroicons-plus"
                                >
                                    Přidat úkol
                                </UButton>
                            </div>

                            <!-- Existing Tasks -->
                            <div v-if="question.tasks && question.tasks.length > 0" class="space-y-2">
                                <div v-for="(task, tIndex) in question.tasks" :key="task.id" class="flex items-center gap-2 p-2 bg-white rounded">
                                    <div class="flex-1">
                                        <p class="text-sm">{{ task.name }}</p>
                                        <p class="text-xs text-gray-500">
                                            Pro: {{ task.responsible.firstname }} {{ task.responsible.surname }}
                                        </p>
                                    </div>
                                    <UButton
                                        size="xs"
                                        color="error"
                                        variant="ghost"
                                        @click="removeTask(question, tIndex)"
                                        icon="i-heroicons-trash"
                                    />
                                </div>
                            </div>

                            <!-- New Task Form -->
                            <div v-if="newTasks[question.id]" class="p-3 bg-white rounded border">
                                <div class="space-y-3">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Název úkolu:</label>
                                        <UInput
                                            v-model="newTasks[question.id].name"
                                            placeholder="Zadejte název úkolu"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Zodpovědná osoba:</label>
                                        <USelect
                                            v-model="selectedDoctors[question.id]"
                                            :items="doctorOptions"
                                            option-attribute="fullName"
                                            placeholder="Vyberte lékaře"
                                            @update:model-value="updateResponsibleDoctor(question.id, $event)"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Popis:</label>
                                        <UTextarea
                                            v-model="newTasks[question.id].description"
                                            placeholder="Zadejte popis úkolu"
                                        />
                                    </div>
                                    <div class="flex justify-end gap-2">
                                        <UButton
                                            size="sm"
                                            color="neutral"
                                            @click="cancelNewTask(question.id)"
                                        >
                                            Zrušit
                                        </UButton>
                                        <UButton
                                            size="sm"
                                            color="primary"
                                            @click="saveTask(question)"
                                        >
                                            Uložit
                                        </UButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Save Button -->
            <div class="flex justify-end">
                <UButton
                    color="primary"
                    @click="saveAllChanges"
                >
                    Uložit všechny změny
                </UButton>
            </div>
        </div>
        <div v-else class="text-center text-gray-500">
            Nejsou k dispozici žádní pacienti pro rozuzlení
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMeetingStore } from '~/stores/meetingStore';
import { ResultType } from '~/types/patient';
import type { Task } from '~/types/patient';

const meetingStore = useMeetingStore();
const doctorStore = useDoctorStore();
const activeMeeting = computed(() => meetingStore.activeMeeting);

// New task form state
const newTasks = ref<Record<string, Partial<Task>>>({});
const selectedDoctors = ref<Record<string, string>>({});

// Result type options
const resultTypeOptions = [
    { label: 'Chirurgický výkon', value: ResultType.SURGICAL_PROCEDURE },
    { label: 'Systémová léčba', value: ResultType.SYSTEMIC_TREATMENT },
    { label: 'Radioterapie', value: ResultType.RADIOTHERAPY },
    { label: 'Onkologická dispenzarizace', value: ResultType.ONCOLOGICAL_DISPENSARY },
    { label: 'Histologická verifikace', value: ResultType.HISTOLOGICAL_VERIFICATION },
    { label: 'Doplnění zobrazovacího vyšetření', value: ResultType.IMAGING_EXAMINATION },
    { label: 'Jiné', value: ResultType.OTHER }
];

// Doctor options for task assignment
const doctorOptions = computed(() => {
    return doctorStore.doctors.map(doctor => ({
        label: `${doctor.firstname} ${doctor.surname}`,
        value: doctor.id
    }));
});

// Update responsible doctor for a task
function updateResponsibleDoctor(questionId: string, doctorId: string) {
    if (newTasks.value[questionId]) {
        const doctor = doctorStore.doctors.find(d => d.id === doctorId);
        if (doctor) {
            newTasks.value[questionId].responsible = doctor;
        }
    }
}

// Add new task form
function addTask(question: any) {
    newTasks.value[question.id] = {
        name: '',
        description: '',
        responsible: undefined,
        createdAt: new Date(),
        deadline: new Date(),
        notificationTime: 24
    };
    selectedDoctors.value[question.id] = '';
}

// Cancel new task
function cancelNewTask(questionId: string) {
    delete newTasks.value[questionId];
    delete selectedDoctors.value[questionId];
}

// Save new task
function saveTask(question: any) {
    const newTask = newTasks.value[question.id];
    if (!newTask.name || !newTask.responsible) return;

    if (!question.tasks) {
        question.tasks = [];
    }

    const taskDeadline = newTask.deadline ? new Date(newTask.deadline) : new Date();

    question.tasks.push({
        id: crypto.randomUUID(),
        ...newTask,
        createdAt: new Date(),
        deadline: taskDeadline,
        notificationTime: 24
    });

    delete newTasks.value[question.id];
    delete selectedDoctors.value[question.id];
}

// Remove task
function removeTask(question: any, taskIndex: number) {
    question.tasks.splice(taskIndex, 1);
}

// Save all changes
function saveAllChanges() {
    // Here you would typically save the changes to your backend
    // For now, we'll just log the changes
    console.log('Saving changes:', activeMeeting.value);
    
    // Show success message
    const toast = useToast();
    toast.add({
        title: 'Úspěch',
        description: 'Změny byly úspěšně uloženy',
        color: 'success',
        icon: 'i-heroicons-check-circle'
    });
}
</script>