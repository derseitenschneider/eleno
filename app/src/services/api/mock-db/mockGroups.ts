import type { Group } from '@/types/types'

const user_id = 'mock-user-123456' // Single user ID for all todos
const mockGroups: Array<Group> = [
  {
    id: 1,
    created_at: new Date(
      new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    name: 'Band "The Dizzy Rascals"',
    dayOfLesson: 'Montag',
    startOfLesson: '15:00',
    endOfLesson: '16:00',
    students: [
      { name: 'Lisa Müller' },
      { name: 'Daniel Hoffmann' },
      { name: 'Lia Hoffmann' },
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
    name: 'Gitarrenensemble',
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
    name: 'Band "Black Ducks"',
    dayOfLesson: 'Samstag',
    startOfLesson: '11:00',
    endOfLesson: '12:00',
    students: [
      { name: 'Thomas Wagner' },
      { name: 'Stefan Ionescu' },
      { name: 'Tamir Iftali' },
      { name: 'Sabrina Neumann' },
      { name: 'Dilan Ross' },
    ],
    user_id: user_id,
    location: 'Gemeindehaus, Großer Saal',
    durationMinutes: 60,
    archive: false,
  },
  {
    id: 4,
    created_at: new Date(
      new Date().getTime() - 180 * 24 * 60 * 60 * 1000,
    ).toISOString(), // 180 days ago
    name: 'Band Sommercamp',
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

export default mockGroups
