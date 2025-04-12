import { useDoctorStore } from '@/stores/doctorStore';
import type { Doctor } from '@/types/doctor';
import type { Patient } from '~/types/patient';

export const seedDoctors = () => {
  const doctorStore = useDoctorStore();
  
  // Only seed if the store is empty
  if (doctorStore.doctors.length === 0) {
    doctorStore.addDoctor({
      id: '1',
      firstname: 'Jan',
      surname: 'Novák',
      email: 'jan.novak@hospital.cz',
      phone: '+420 777 123 456',
      specialization: 'Onkologie',
      password: 'password',
      patients: [
        {
          id: '1',
          name: 'Martin',
          lastName: 'Kopecký',
          gender: 'muž',
          aisId: 'AIS00012345',
          insuranceId: '111',
          birthNumber: '900101/1234',
          dateOfBirth: '1990-01-01',
          questions: {
            tasks: [
            {
              id: 'task1',
              name: 'PET/CT vyšetření',
              description: 'Objednat PET/CT vyšetření pro staging onemocnění',
              createdAt: new Date('2025-04-10T11:00:00'),
              deadline: new Date('2025-04-25T00:00:00'),
            },
            {
              id: 'task2',
              name: 'Dokumentace pro radioterapii',
              description: 'Vytvořit dokumentaci pro radioterapii',
              createdAt: new Date('2025-04-15T10:00:00'),
              deadline: new Date('2025-05-05T00:00:00'),
            }
          ]
          }
        } as Patient,
        {
          id: '2',
          name: 'Petr',
          lastName: 'Svoboda',
          gender: 'muž',
          aisId: 'AIS00023456',
          insuranceId: '201',
          birthNumber: '850612/1122',
          dateOfBirth: '1985-06-12',
          questions: {
            tasks: [
              {
                id: 'task1',
                name: 'PET/CT vyšetření',
              description: 'Objednat PET/CT vyšetření pro staging onemocnění',
              createdAt: new Date('2025-04-10T11:00:00'),
              deadline: new Date('2025-04-25T00:00:00'),
            },
            {
              id: 'task2',
              name: 'Dokumentace pro radioterapii',
              description: 'Vytvořit dokumentaci pro radioterapii',
              createdAt: new Date('2025-04-15T10:00:00'),
              deadline: new Date('2025-05-05T00:00:00'),
            }
          ]
          }
        } as Patient,
        {
          id: '3',
          name: 'Martin',
          lastName: 'Dvořák',
          gender: 'muž',
          aisId: 'AIS00034567',
          insuranceId: '301',
          birthNumber: '800715/1234',
          dateOfBirth: '1980-07-15',
          questions: {
            tasks: [
              {
                id: 'task1',
                name: 'PET/CT vyšetření',
                description: 'Objednat PET/CT vyšetření pro staging onemocnění',
              }
            ]
          }
        } as Patient
      ],
      tasks: []
    } as Doctor);

    doctorStore.addDoctor({
      id: '2',
      firstname: 'Marie',
      surname: 'Svobodová',
      email: 'marie.svobodova@hospital.cz',
      phone: '+420 777 234 567',
      specialization: 'Rádiologie',
      password: 'password',
      patients: [],
      tasks: []
    } as Doctor);

    doctorStore.addDoctor({
      id: '3',
      firstname: 'Petr',
      surname: 'Dvořák',
      email: 'petr.dvorak@hospital.cz',
      phone: '+420 777 345 678',
      specialization: 'Chirurgie',
      password: 'password',
      patients: [],
      tasks: []
    } as Doctor);

    console.log('Doctor data seeded successfully.');
  }
}; 