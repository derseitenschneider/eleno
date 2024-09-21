import type { Note, NotesBackgrounds } from '../../../types/types'

const user_id = 'mock-user-123456'
function generateNote(entityId: number, isGroup: boolean, order: number): Note {
  const entityType = isGroup ? 'Gruppe' : 'Schüler'
  const entityName = isGroup ? getGroupName(entityId) : getStudentName(entityId)

  const backgrounds: NotesBackgrounds[] = ['red', 'green', 'blue', 'yellow']

  return {
    id: Math.random() * 1_000_000,
    created_at: new Date().toISOString(),
    studentId: isGroup ? undefined : entityId,
    groupId: isGroup ? entityId : undefined,
    title: `Infos zu ${entityName}`,
    text: generateNoteText(entityType, entityName),
    user_id: user_id,
    order: order,
    backgroundColor:
      backgrounds[Math.floor(Math.random() * backgrounds.length)] || null,
  }
}

function getGroupName(groupId: number): string {
  const groupNames: { [key: string]: string } = {
    '1': 'Anfänger Posaunengruppe',
    '2': 'Fortgeschrittene Posaunenspieler',
    '3': 'Posaunenchor der Gemeinde',
  }
  return groupNames[groupId.toString()] || 'Unbekannte Gruppe'
}

function getStudentName(studentId: bigint): string {
  const studentNames: { [key: string]: string } = {
    '1': 'Lisa Müller',
    '2': 'Max Schmidt',
    '3': 'Emma Weber',
    '4': 'Felix Bauer',
    '5': 'Sophie Klein',
    '6': 'Luca Hoffmann',
    '7': 'Hannah Schulz',
    '8': 'Thomas Wagner',
  }
  return studentNames[studentId.toString()] || 'Unbekannter Schüler'
}

function generateNoteText(entityType: string, entityName: string): string {
  const notes = [
    `${entityName} zeigt große Fortschritte bei der Atemkontrolle. Weiter an Ausdauer arbeiten.`,
    `${entityType} ${entityName} benötigt zusätzliche Unterstützung bei der Artikulation in schnellen Passagen.`,
    'Intonation in der hohen Lage verbessert, aber noch Raum für Verfeinerung.',
    `${entityName} hat Schwierigkeiten mit dem Rhythmus in synkopierten Stücken. Mehr Übungen planen.`,
    'Ausgezeichnete Fortschritte bei der Dynamikkontrolle. Nächster Fokus: Ausdrucksstärke.',
    `${entityType} ${entityName} zeigt großes Potenzial für Soloauftritte. Möglichkeiten für Vorspielen suchen.`,
    'Mundstückbuzz verbessert, aber weiterhin an der Lippenspannung arbeiten.',
    `${entityName} braucht Ermutigung, zu Hause regelmäßiger zu üben. Mit Eltern besprechen?`,
    `Gute Ensemblefähigkeiten. ${entityType} ${entityName} unterstützt andere Spieler gut.`,
    'Technik verbessert, jetzt mehr an musikalischer Interpretation arbeiten.',
  ]

  return notes[Math.floor(Math.random() * notes.length)] || ''
}

// Generate notes for students
const studentNotes: Note[] = [
  generateNote(1, false, 0), // Lisa Müller
  generateNote(2, false, 0), // Max Schmidt
  generateNote(3, false, 0), // Emma Weber
  generateNote(4, false, 0), // Felix Bauer
  generateNote(5, false, 0), // Sophie Klein
  generateNote(6, false, 0), // Luca Hoffmann
  generateNote(7, false, 0), // Hannah Schulz
  generateNote(8, false, 0), // Thomas Wagner
]

// Generate notes for groups
const groupNotes: Note[] = [
  generateNote(1, true, 0), // Anfänger Posaunengruppe
  generateNote(2, true, 0), // Fortgeschrittene Posaunenspieler
  generateNote(3, true, 0), // Posaunenchor der Gemeinde
]

// Generate a few extra notes for variety
const extraNotes: Note[] = [
  generateNote(1, false, 1), // Extra note for Lisa Müller
  generateNote(4, false, 1), // Extra note for Felix Bauer
  generateNote(2, true, 1), // Extra note for Fortgeschrittene Posaunenspieler
]

export const mockNotes: Note[] = [...studentNotes, ...groupNotes, ...extraNotes]
