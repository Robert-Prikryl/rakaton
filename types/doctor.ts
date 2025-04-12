import type { Patient } from "./patient";
import type { Task } from "./patient";

export interface Doctor {
    id: string;
    firstname: string;
    surname: string;
    email: string;
    phone: string;
    specialization: string;
    patients: Patient[];
    tasks: Task[];
}