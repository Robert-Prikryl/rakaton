import { usePatientStore } from '@/stores/patientStore';
import type { Patient } from '@/types/patient';

export const seedPatients = () => {
  const patientStore = usePatientStore();
  
  // Only seed if the store is empty
  if (patientStore.patients.length === 0) {
    // Male patients
    patientStore.addPatient({
      id: '1',
      name: 'Jan',
      lastName: 'Novák',
      gender: 'male',
      aisId: 'AIS00012345',
      insuranceId: '111',
      birthNumber: '900101/1234',
      dateOfBirth: '1990-01-01'
    } as Patient);

    patientStore.addPatient({
      id: '2',
      name: 'Petr',
      lastName: 'Svoboda',
      gender: 'male',
      aisId: 'AIS00023456',
      insuranceId: '201',
      birthNumber: '850612/1122',
      dateOfBirth: '1985-06-12'
    } as Patient);

    patientStore.addPatient({
      id: '3',
      name: 'Martin',
      lastName: 'Dvořák',
      gender: 'male',
      aisId: 'AIS00034567',
      insuranceId: '205',
      birthNumber: '780523/3344',
      dateOfBirth: '1978-05-23'
    } as Patient);

    // Female patients
    patientStore.addPatient({
      id: '4',
      name: 'Marie',
      lastName: 'Procházková',
      gender: 'female',
      aisId: 'AIS00045678',
      insuranceId: '207',
      birthNumber: '915230/4455',
      dateOfBirth: '1991-12-30'
    } as Patient);

    patientStore.addPatient({
      id: '5',
      name: 'Lucie',
      lastName: 'Černá',
      gender: 'female',
      aisId: 'AIS00056789',
      insuranceId: '111',
      birthNumber: '880415/5566',
      dateOfBirth: '1988-04-15'
    } as Patient);

    patientStore.addPatient({
      id: '6',
      name: 'Kateřina',
      lastName: 'Veselá',
      gender: 'female',
      aisId: 'AIS00067890',
      insuranceId: '201',
      birthNumber: '950708/6677',
      dateOfBirth: '1995-07-08'
    } as Patient);

    // Older patients
    patientStore.addPatient({
      id: '7',
      name: 'Jiří',
      lastName: 'Kučera',
      gender: 'male',
      aisId: 'AIS00078901',
      insuranceId: '205',
      birthNumber: '510304/7788'
    } as Patient);

    patientStore.addPatient({
      id: '8',
      name: 'Anna',
      lastName: 'Marešová',
      gender: 'female',
      aisId: 'AIS00089012',
      insuranceId: '207',
      birthNumber: '560219/8899',
      dateOfBirth: '1956-02-19'
    } as Patient);

    // Younger patients
    patientStore.addPatient({
      id: '9',
      name: 'Tomáš',
      lastName: 'Hájek',
      gender: 'male',
      aisId: 'AIS00090123',
      insuranceId: '111',
      birthNumber: '000825/9900',
      dateOfBirth: '2000-08-25'
    } as Patient);

    patientStore.addPatient({
      id: '10',
      name: 'Tereza',
      lastName: 'Pokorná',
      gender: 'female',
      aisId: 'AIS00101234',
      insuranceId: '201',
      birthNumber: '010612/0011',
      dateOfBirth: '2001-06-12'
    } as Patient);

    console.log('Patient data seeded successfully.');
  }
}; 