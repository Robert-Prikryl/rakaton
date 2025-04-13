import type { Doctor } from "./doctor";
import type { PatientRecord } from "./patient";

export enum MeetingType {
    ORL = 'orl',
    HORNI_GIT = 'horní git', 
    HRUDNI = 'hrudní',
    MAMMARNI = 'mammární',
    PLICNI = 'plicní',
    UROLOGICKY = 'urologický',
    NEUROLOGICKY = 'neurologický',
    SARCOMABOARD = 'sarcomaboard',
    ONKOGYNEKOLOGICKY = 'onkogynekologický',
    DOLNI_GIT = 'dolní git'
}

export interface Meeting {
    id: string;
    name: string;
    place: string;
    description: string;
    doctors: Doctor[];
    date: Date;
    notification: number;
    notes: string;
    patientRecords: PatientRecord[];
    reports?: string[];
    isTeplate: boolean;
}