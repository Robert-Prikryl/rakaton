import { useMeetingStore } from '@/stores/meetingStore';
import type { Meeting } from '@/types/meeeting';
import { MeetingType } from '@/types/meeeting';
import type { PatientRecord } from '@/types/patient';
import { ModalityType, ResultType } from '@/types/patient';

export const seedMeetings = () => {
  const meetingStore = useMeetingStore();

  // Create some dummy patient records
  const dummyPatientRecords: PatientRecord[] = [
    {
      id: 'pat1',
      name: 'Josef',
      lastName: 'Novák',
      gender: 'muž',
      aisId: 'AIS123456',
      insuranceId: 'VZP123456789',
      birthNumber: '7501011234',
      dateOfBirth: '1975-01-01',
      epikriza: 'Pacient po extirpaci ložiska nad hřebenem lopaty kosti kyčelní vlevo na spádové chirurgické ambulanci (anamnesticky předpokládán organizovaný hematom). Dle definitivní histologie neklasifikovaný vřetenobuněčný nízce maligní tumor. Nyní po MR ve FNM.',
      modality: [
        {
          id: 'mod1',
          type: ModalityType.CT,
          date: new Date('2025-03-15'),
          place: 'Radiologické oddělení',
          results: 'Nález v pravém horním laloku'
        }
      ],
      questions: [
        {
          id: 'q1',
          reciepient: {
            id: 'doc1',
            surname: 'Novotný',
            firstname: 'Jan',
            email: 'jan.novotny@nemocnice.cz',
            phone: '+420 777 123 456',
            specialization: 'Onkologie',
            patients: [],
            tasks: []
          },
          question: 'Jaká je doporučená léčba pro pacienta s plicním karcinomem?',
          note: 'Pacient je v dobrém stavu, vhodný kandidát pro chirurgický výkon',
          result: ResultType.SURGICAL_PROCEDURE,
          tasks: []
        },
        {
          id: 'q2',
          reciepient: {
            id: 'doc2',
            surname: 'Svobodová',
            firstname: 'Marie',
            email: 'marie.svobodova@nemocnice.cz',
            phone: '+420 777 234 567',
            specialization: 'Chirurgie',
            patients: [],
            tasks: []
          },
          question: 'Je nutné doplnit další zobrazovací vyšetření před operací?',
          note: 'Zvážit PET/CT pro vyloučení vzdálených metastáz',
          result: ResultType.IMAGING_EXAMINATION,
          tasks: []
        }
      ]
    },
    {
      id: 'pat2',
      name: 'Marie',
      lastName: 'Svobodová',
      gender: 'žena',
      aisId: 'AIS234567',
      insuranceId: 'VZP234567890',
      birthNumber: '8202025678',
      dateOfBirth: '1982-02-02',
      epikriza: 'Pacientka s anamnézou karcinomu prsu',
      modality: [
        {
          id: 'mod2',
          type: ModalityType.MR,
          date: new Date('2025-03-10'),
          place: 'Magnetická rezonance',
          results: 'Nález v pravém prsu'
        }
      ],
      questions: [
        {
          id: 'q3',
          reciepient: {
            id: 'doc1',
            surname: 'Novotný',
            firstname: 'Jan',
            email: 'jan.novotny@nemocnice.cz',
            phone: '+420 777 123 456',
            specialization: 'Onkologie',
            patients: [],
            tasks: []
          },
          question: 'Jaká je doporučená systémová léčba?',
          note: 'Zvážit neoadjuvantní chemoterapii před chirurgickým výkonem',
          result: ResultType.SYSTEMIC_TREATMENT,
          tasks: []
        },
        {
          id: 'q4',
          reciepient: {
            id: 'doc2',
            surname: 'Svobodová',
            firstname: 'Marie',
            email: 'marie.svobodova@nemocnice.cz',
            phone: '+420 777 234 567',
            specialization: 'Chirurgie',
            patients: [],
            tasks: []
          },
          question: 'Jaký je plánovaný rozsah chirurgického výkonu?',
          note: 'Zvážit sentinelovou biopsii',
          result: ResultType.HISTOLOGICAL_VERIFICATION,
          tasks: []
        }
      ]
    },
    {
      id: 'pat3',
      name: 'Petr',
      lastName: 'Dvořák',
      gender: 'muž',
      aisId: 'AIS345678',
      insuranceId: 'VZP345678901',
      birthNumber: '6503039012',
      dateOfBirth: '1965-03-03',
      epikriza: 'Pacient s anamnézou kolorektálního karcinomu',
      modality: [
        {
          id: 'mod3',
          type: ModalityType.PET_CT,
          date: new Date('2025-03-05'),
          place: 'Nukleární medicína',
          results: 'Nález v tlustém střevě'
        }
      ],
      questions: [
        {
          id: 'q5',
          reciepient: {
            id: 'doc1',
            surname: 'Novotný',
            firstname: 'Jan',
            email: 'jan.novotny@nemocnice.cz',
            phone: '+420 777 123 456',
            specialization: 'Onkologie',
            patients: [],
            tasks: []
          },
          question: 'Jaká je doporučená adjuvantní léčba?',
          note: 'Zvážit kombinaci chemoterapie a radioterapie',
          result: ResultType.RADIOTHERAPY,
          tasks: []
        },
        {
          id: 'q6',
          reciepient: {
            id: 'doc2',
            surname: 'Svobodová',
            firstname: 'Marie',
            email: 'marie.svobodova@nemocnice.cz',
            phone: '+420 777 234 567',
            specialization: 'Chirurgie',
            patients: [],
            tasks: []
          },
          question: 'Jaký je plán dispenzarizace?',
          note: 'Navrhnout pravidelnou kontrolu každé 3 měsíce',
          result: ResultType.ONCOLOGICAL_DISPENSARY,
          tasks: []
        }
      ]
    }
  ];

  const dummyMeetings: Meeting[] = [
    {
      id: '1',
      name: MeetingType.ONKOGYNEKOLOGICKY,
      place: 'Konferenční místnost A, 3. patro',
      description: 'Pravidelné setkání onkogynekologického týmu',
      doctors: [
        {
          id: 'doc1',
          surname: 'Novotný',
          firstname: 'Jan',
          email: 'jan.novotny@nemocnice.cz',
          phone: '+420 777 123 456',
          specialization: 'Onkologie',
          patients: [],
          tasks: []
        },
        {
          id: 'doc2',
          surname: 'Svobodová',
          firstname: 'Marie',
          email: 'marie.svobodova@nemocnice.cz',
          phone: '+420 777 234 567',
          specialization: 'Chirurgie',
          patients: [],
          tasks: []
        }
      ],
      date: new Date('2025-04-15T10:00:00'),
      notification: 24, // 24 hours before meeting
      notes: ['Přinést výsledky posledních vyšetření', 'Diskuze nových léčebných postupů'],
      patientRecords: [dummyPatientRecords[1]], // Marie Svobodová
      reports: []
    },
    {
      id: '2',
      name: MeetingType.PLICNI,
      place: 'Seminární místnost B, 2. patro',
      description: 'Konzultace plicních nálezů',
      doctors: [
        {
          id: 'doc3',
          surname: 'Veselý',
          firstname: 'Martin',
          email: 'martin.vesely@nemocnice.cz',
          phone: '+420 777 789 012',
          specialization: 'Pneumologie',
          patients: [],
          tasks: []
        }
      ],
      date: new Date('2025-04-20T14:30:00'),
      notification: 12, // 12 hours before meeting
      notes: ['Kontrola RTG snímků', 'Plánování dalších vyšetření'],
      patientRecords: [dummyPatientRecords[0]], // Josef Novák
      reports: []
    },
    {
      id: '3',
      name: MeetingType.HORNI_GIT,
      place: 'Online - Teams',
      description: 'Multidisciplinární tým - horní GIT',
      doctors: [
        {
          id: 'doc4',
          surname: 'Kučerová',
          firstname: 'Eva',
          email: 'eva.kucerova@nemocnice.cz',
          phone: '+420 777 678 901',
          specialization: 'Onkologie',
          patients: [],
          tasks: []
        },
        {
          id: 'doc5',
          surname: 'Horáková',
          firstname: 'Lucie',
          email: 'lucie.horakova@nemocnice.cz',
          phone: '+420 777 890 123',
          specialization: 'Chirurgie',
          patients: [],
          tasks: []
        }
      ],
      date: new Date('2024-04-25T09:00:00'),
      notification: 48, // 48 hours before meeting
      notes: ['Příprava dokumentace pro nové pacienty'],
      patientRecords: [],
      reports: []
    },
    {
      id: '4',
      name: MeetingType.NEUROLOGICKY,
      place: 'Konferenční místnost C, 4. patro',
      description: 'Pravidelné setkání neurologického týmu',
      doctors: [
        {
          id: 'doc6',
          surname: 'Černá',
          firstname: 'Jana',
          email: 'jana.cerna@nemocnice.cz',
          phone: '+420 777 456 789',
          specialization: 'Neurologie',
          patients: [],
          tasks: []
        },
        {
          id: 'doc7',
          surname: 'Procházka',
          firstname: 'Tomáš',
          email: 'tomas.prochazka@nemocnice.cz',
          phone: '+420 777 567 890',
          specialization: 'Urologie',
          patients: [],
          tasks: []
        }
      ],
      date: new Date('2025-04-10T11:00:00'), // Past meeting (2 days before today)
      notification: 24,
      notes: ['Projednání výsledků vyšetření', 'Plánování další léčby'],
      patientRecords: [dummyPatientRecords[2]], // Petr Dvořák
      reports: ['Pacient je vhodný kandidát pro adjuvantní léčbu'] as any[]
    }
  ];

  // Update the questions in the past meeting's patient record to include tasks
  dummyPatientRecords[2].questions[0].tasks = [
    {
      id: 'task1',
      name: 'PET/CT vyšetření',
      responsible: {
        id: 'doc1',
        surname: 'Novotný',
        firstname: 'Jan',
        email: 'jan.novotny@nemocnice.cz',
        phone: '+420 777 123 456',
        specialization: 'Onkologie',
        patients: [],
        tasks: []
      },
      description: 'Objednat PET/CT vyšetření pro staging onemocnění',
      createdAt: new Date('2025-04-10T11:00:00'),
      deadline: new Date('2025-04-25T00:00:00'),
      notificationTime: 24
    },
    {
      id: 'task2',
      name: 'Dokumentace pro radioterapii',
      responsible: {
        id: 'doc2',
        surname: 'Svobodová',
        firstname: 'Marie',
        email: 'marie.svobodova@nemocnice.cz',
        phone: '+420 777 234 567',
        specialization: 'Chirurgie',
        patients: [],
        tasks: []
      },
      description: 'Vytvořit plán radioterapie a připravit potřebnou dokumentaci',
      createdAt: new Date('2025-04-10T11:00:00'),
      deadline: new Date('2025-04-20T00:00:00'),
      notificationTime: 12,
      realizedAt: new Date('2025-04-15T00:00:00')
    }
  ];

  dummyPatientRecords[2].questions[1].tasks = [
    {
      id: 'task3',
      name: 'Plán adjuvantní léčby',
      responsible: {
        id: 'doc1',
        surname: 'Novotný',
        firstname: 'Jan',
        email: 'jan.novotny@nemocnice.cz',
        phone: '+420 777 123 456',
        specialization: 'Onkologie',
        patients: [],
        tasks: []
      },
      description: 'Detailní plán chemoterapie a radioterapie',
      createdAt: new Date('2025-04-10T11:00:00'),
      deadline: new Date('2025-04-15T00:00:00'),
      notificationTime: 24
    },
    {
      id: 'task4',
      name: 'Dispenzarizační plán',
      responsible: {
        id: 'doc2',
        surname: 'Svobodová',
        firstname: 'Marie',
        email: 'marie.svobodova@nemocnice.cz',
        phone: '+420 777 234 567',
        specialization: 'Chirurgie',
        patients: [],
        tasks: []
      },
      description: 'Vytvořit harmonogram kontrolních vyšetření',
      createdAt: new Date('2025-04-10T11:00:00'),
      deadline: new Date('2025-04-12T00:00:00'),
      notificationTime: 12,
      realizedAt: new Date('2025-04-11T00:00:00')
    }
  ];

  // Add meetings to the store
  dummyMeetings.forEach(meeting => {
    meetingStore.addMeeting(meeting);
  });
}; 
