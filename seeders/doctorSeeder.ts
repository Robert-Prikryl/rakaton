import { useDoctorStore } from '@/stores/doctorStore';
import type { Doctor } from '@/types/doctor';

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
      specialization: 'Oncology',
      password: 'password',
      patients: [],
      tasks: []
    } as Doctor);

    doctorStore.addDoctor({
      id: '2',
      firstname: 'Marie',
      surname: 'Svobodová',
      email: 'marie.svobodova@hospital.cz',
      phone: '+420 777 234 567',
      specialization: 'Radiology',
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
      specialization: 'Surgery',
      password: 'password',
      patients: [],
      tasks: []
    } as Doctor);

    console.log('Doctor data seeded successfully.');
  }
}; 