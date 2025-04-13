import type { Doctor } from "./doctor";
import type { PatientRecord } from "./patient";

export enum MeetingType {
    ORL = 'orl',
    HORNI_GIT = 'horni git', 
    HRUDNI = 'hrudni',
    MAMMARNI = 'mammarni',
    PLICNI = 'plicni',
    UROLOGICKY = 'urologicky',
    NEUROLOGICKY = 'neurologicky',
    SARCOMABOARD = 'sarcomaboard',
    ONKOGYNEKOLOGICKY = 'onkogynekologicky',
    DOLNI_GIT = 'dolni_git'
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
    isEdit: boolean;
}