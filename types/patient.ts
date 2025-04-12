import type { Doctor } from "./doctor";

export enum ResultType {
    SURGICAL_PROCEDURE = 'Chirurgický výkon',
    SYSTEMIC_TREATMENT = 'Systémová léčba',
    RADIOTHERAPY = 'Radioterapie',
    ONCOLOGICAL_DISPENSARY = 'Onkologická dispenzarizace', 
    HISTOLOGICAL_VERIFICATION = 'Histologická verifikace',
    IMAGING_EXAMINATION = 'Doplnění zobrazovacího vyšetření',
    OTHER = 'Jiné'
}

export interface Task {
    id: string;
    name: string; //Type
    responsible: Doctor;
    description: string;
    createdAt: Date;
    deadline: Date;
    notificationTime: number; //In hours
    realizedAt?: Date; //Here I know if it was done or not
}

export enum ModalityType {
    CT = 'ct',
    MR = 'mr',
    PET_CT = 'pet_ct',
    OTHER = 'iné'
}

export interface Modality {
    id: string;
    type: ModalityType;
    date: Date;
    place: string;
    results: string;
}

export interface Question {
    id: string;
    reciepient: Doctor;
    question: string;
    note: string;
    result: ResultType;
    tasks: Task[];
}

export interface PatientRecord extends Patient {
    epikriza: string;
    modality: Modality[];
    questions: Question[];
}

export interface Patient {
    id: string;
    name: string;
    lastName: string
    gender: string
    aisId: string
    insuranceId: string
    birthNumber: string
    dateOfBirth: string
}
