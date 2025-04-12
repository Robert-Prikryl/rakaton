import type { TimelinePoint, TimelineRange } from '@/types/timeline';

export const pushSeeds = (recordsStore: ReturnType<typeof useRecordsStore>) => {
  // Seed the records directly
  if (recordsStore.records.length === 0) {
    recordsStore.addRecord({
      id: '1',
      date: new Date('2025-03-15'),
      color: '#FFD700',
      description: 'Kontrola u lékaře',
      data: 'testData',
    } as TimelinePoint);

    recordsStore.addRecord({
      id: '2',
      date: new Date('2025-02-15'),
      color: '#FFD700',
      description: 'Kontrola u lékaře',
      data: 'testData',
    } as TimelinePoint);

    // recordsStore.addRecord({
    //   id: '3',
    //   startDate: new Date('2025-02-01'),
    //   endDate: new Date('2025-02-15'),
    //   color: '#00FF00',
    //   description: 'Pozitivna reakcia',
    //   data: 'testData',
    // } as TimelineRange);
  }
}