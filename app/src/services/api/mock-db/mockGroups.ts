import { Group } from '@/types/types'

const user_id = 'mock-user-123456' // Single user ID for all todos
const generateMockGroups = (): Group[] => {
  return [
    {
      id: 1,
      created_at: new Date(
        new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      name: 'Anfänger Posaunengruppe',
      dayOfLesson: 'Montag',
      startOfLesson: '15:00',
      endOfLesson: '16:00',
      students: [
        { name: 'Lisa Müller' },
        { name: 'Max Schmidt' },
        { name: 'Emma Weber' },
      ],
      user_id: user_id,
      location: 'Musikschule, Raum 101',
      durationMinutes: 60,
      archive: false,
    },
    {
      id: 2,
      created_at: new Date(
        new Date().getTime() - 60 * 24 * 60 * 60 * 1000,
      ).toISOString(), // 60 days ago
      name: 'Fortgeschrittene Posaunenspieler',
      dayOfLesson: 'Mittwoch',
      startOfLesson: '19:00',
      endOfLesson: '20:00',
      students: [
        { name: 'Felix Bauer' },
        { name: 'Sophie Klein' },
        { name: 'Luca Hoffmann' },
        { name: 'Hannah Schulz' },
      ],
      user_id: user_id,
      location: 'Musikschule, Raum 205',
      durationMinutes: 90,
      archive: false,
    },
    {
      id: 3,
      created_at: new Date(
        new Date().getTime() - 90 * 24 * 60 * 60 * 1000,
      ).toISOString(), // 90 days ago
      name: 'Posaunenchor der Gemeinde',
      dayOfLesson: 'Samstag',
      startOfLesson: '10:00',
      endOfLesson: '12:00',
      students: [
        { name: 'Thomas Wagner' },
        { name: 'Julia Fischer' },
        { name: 'Markus Schneider' },
        { name: 'Laura Meyer' },
        { name: 'Daniel Krause' },
      ],
      user_id: user_id,
      location: 'Gemeindehaus, Großer Saal',
      durationMinutes: 120,
      archive: false,
    },
    {
      id: 4,
      created_at: new Date(
        new Date().getTime() - 180 * 24 * 60 * 60 * 1000,
      ).toISOString(), // 180 days ago
      name: 'Sommercamp Posaunengruppe',
      dayOfLesson: null,
      startOfLesson: null,
      endOfLesson: null,
      students: [
        { name: 'Sophia Richter' },
        { name: 'Lukas Becker' },
        { name: 'Emilia Wolf' },
        { name: 'Noah Schreiber' },
        { name: 'Mia Neumann' },
      ],
      user_id: user_id,
      location: 'Musikcamp Waldsee',
      durationMinutes: null,
      archive: true, // This group is archived
    },
  ]
}

export const mockGroups: Group[] = generateMockGroups()