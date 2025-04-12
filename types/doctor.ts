import type { Patient } from "./patient";
import type { Task } from "./patient";

export interface Doctor {
    id: string;
    surname: string;
    firstname: string;
    email: string;
    phone: string;
    specialization: string;
    patients: Patient[];
    tasks: Task[];
}