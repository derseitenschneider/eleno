import type { Lesson } from '@/types/types'

const user_id = 'mock-user-123456'

function getLastLessonDate(dayOfWeek: number): Date {
  const today = new Date()
  const lastLesson = new Date(
    today.setDate(today.getDate() - ((today.getDay() - dayOfWeek + 7) % 7)),
  )
  lastLesson.setHours(0, 0, 0, 0)
  return lastLesson
}

function generateUniqueContent(
  entityId: bigint,
  isGroup: boolean,
  weekOffset: number,
): { content: string; homework: string } {
  const entityType = isGroup ? 'Gruppe' : 'Schüler'
  const entityName = isGroup ? getGroupName(entityId) : getStudentName(entityId)
  const level = isGroup ? getGroupLevel(entityId) : getStudentLevel(entityId)

  const topics = [
    'Atemtechnik',
    'Tonbildung',
    'Artikulation',
    'Rhythmus',
    'Dynamik',
    'Tonleitern',
    'Etüden',
    'Orchesterliteratur',
    'Solospielen',
    'Improvisation',
  ]

  const chosenTopic = topics[Math.floor(Math.random() * topics.length)] || ''
  const piece = getPieceForLevel(level)

  const content = `
    <p><b>Lektion für ${entityType} ${entityName} (Woche ${3 - weekOffset}):</b></p>
    <p>Heute haben wir uns auf <i>${chosenTopic}</i> konzentriert. Wir haben Folgendes durchgeführt:</p>
    <ul>
      <li>${generateExercise(chosenTopic, level)}</li>
      <li>${generateExercise(chosenTopic, level)}</li>
      <li>Arbeit am Stück "${piece}"</li>
    </ul>
    <p>${entityType} ${entityName} hat ${generateProgress(level)} gemacht.</p>
  `

  const homework = `
    <p><b>Hausaufgaben für ${entityType} ${entityName}:</b></p>
    <ul>
      <li>${generateHomeworkTask(chosenTopic, level)}</li>
      <li>${generateHomeworkTask(chosenTopic, level)}</li>
      <li>Übe "${piece}" - konzentriere dich auf ${generateFocusArea(level)}</li>
    </ul>
    <p><i>Ziel für nächste Woche:</i> ${generateGoal(level)}</p>
  `

  return { content, homework }
}

function getGroupName(groupId: bigint): string {
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

function getGroupLevel(groupId: bigint): string {
  const groupLevels: { [key: string]: string } = {
    '1': 'Anfänger',
    '2': 'Fortgeschritten',
    '3': 'Fortgeschritten',
  }
  return groupLevels[groupId.toString()] || 'Mittel'
}

function getStudentLevel(studentId: bigint): string {
  const studentLevels: { [key: string]: string } = {
    '1': 'Anfänger',
    '2': 'Anfänger',
    '3': 'Anfänger',
    '4': 'Fortgeschritten',
    '5': 'Fortgeschritten',
    '6': 'Mittel',
    '7': 'Mittel',
    '8': 'Fortgeschritten',
  }
  return studentLevels[studentId.toString()] || 'Mittel'
}

function getPieceForLevel(level: string): string {
  const pieces = {
    Anfänger: [
      'Ode an die Freude',
      'Greensleeves',
      'Amazing Grace',
      'When the Saints Go Marching In',
      'Simple Gifts',
    ],
    Mittel: [
      'Eine kleine Nachtmusik',
      'Canon in D',
      'The Entertainer',
      'Rondeau',
      'Bourree in E minor',
    ],
    Fortgeschritten: [
      'Concerto for Trombone',
      'Morceau Symphonique',
      'Sonata in F major',
      'Romance',
      'Concertino for Trombone',
    ],
  }
  return pieces[level][Math.floor(Math.random() * pieces[level].length)]
}

function generateExercise(topic: string, level: string): string {
  const exercises = {
    Atemtechnik: [
      'Lange Töne mit gleichmäßigem Luftstrom',
      'Atemstütze-Übungen',
      'Zwerchfell-Kontrolle',
    ],
    Tonbildung: [
      'Lippenspannungsübungen',
      'Mundstück-Buzz-Training',
      'Klangfarbenübungen',
    ],
    Artikulation: [
      'Staccato-Etüden',
      'Legato-Verbindungen',
      'Zungen-Stoß-Übungen',
    ],
    Rhythmus: ['Synkopen-Studien', 'Polyrhythmische Übungen', 'Metronomarbeit'],
    Dynamik: [
      'Crescendo-Decrescendo-Übungen',
      'Kontrollierte Lautstärkeänderungen',
      'Piano-Forte-Kontraste',
    ],
    Tonleitern: [
      'Dur- und Moll-Tonleitern',
      'Chromatische Läufe',
      'Ganzton-Skalen',
    ],
    Etüden: [
      'Kopprasch Etüden',
      'Rochut Melodische Studien',
      'Blume 36 Studies',
    ],
    Orchesterliteratur: [
      'Auszüge aus Sinfonien',
      'Opern-Soli',
      'Blasorchester-Repertoire',
    ],
    Solospielen: [
      'Interpretation von Solostücken',
      'Ausdrucksübungen',
      'Bühnenpraxis',
    ],
    Improvisation: [
      'Blues-Skalen-Übungen',
      'Jazz-Pattern-Training',
      'Freie Improvisation',
    ],
  }
  return exercises[topic][Math.floor(Math.random() * exercises[topic].length)]
}

function generateProgress(level: string): string {
  const progress = [
    'bemerkenswerte Fortschritte',
    'stetige Verbesserungen',
    'gute Entwicklung',
    'wachsendes Verständnis',
    'zunehmende Sicherheit',
  ]
  return progress[Math.floor(Math.random() * progress.length)]
}

function generateHomeworkTask(topic: string, level: string): string {
  const tasks = {
    Atemtechnik: [
      'Täglich 10 Minuten Atemübungen',
      'Atemstütze beim Spielen langer Töne üben',
    ],
    Tonbildung: ['Tägliche Einblasübungen', 'Mundstück-Summen für 5 Minuten'],
    Artikulation: [
      'Staccato-Übungen mit verschiedenen Rhythmen',
      'Legato-Verbindungen in Tonleitern',
    ],
    Rhythmus: [
      'Metronom-Übungen mit wechselnden Tempi',
      'Synkopen in verschiedenen Taktarten üben',
    ],
    Dynamik: [
      'Lautstärke-Kontrollübungen',
      'Crescendo-Decrescendo auf einem Ton',
    ],
    Tonleitern: ['Tägliches Tonleiter-Training', 'Arpeggien in allen Tonarten'],
    Etüden: [
      'Etüde Nr. X langsam und präzise üben',
      'Schwierige Passagen der Etüde isoliert üben',
    ],
    Orchesterliteratur: [
      'Orchesterstelle XY üben',
      'Intonation in Orchesterpassagen kontrollieren',
    ],
    Solospielen: [
      'An der Interpretation von Solostück X arbeiten',
      'Vortragsstück ohne Noten üben',
    ],
    Improvisation: [
      'Über einfache Akkordfolgen improvisieren',
      'Jazz-Standards-Melodien auswendig lernen',
    ],
  }
  return tasks[topic][Math.floor(Math.random() * tasks[topic].length)]
}

function generateFocusArea(level: string): string {
  const areas = [
    'Intonation',
    'Rhythmus',
    'Ausdruck',
    'Tonqualität',
    'Artikulation',
  ]
  return areas[Math.floor(Math.random() * areas.length)]
}

function generateGoal(level: string): string {
  const goals = [
    'Verbessere die Atemkontrolle in schnellen Passagen',
    'Arbeite an der Präzision der Artikulation',
    'Erweitere den dynamischen Bereich',
    'Verfeinere die Intonation in der hohen Lage',
    'Entwickle mehr Ausdruckskraft im Spiel',
  ]
  return goals[Math.floor(Math.random() * goals.length)]
}

function generateLessonsForEntity(
  entityId: bigint,
  isGroup: boolean,
  dayOfWeek: number,
): Lesson[] {
  const lastLessonDate = getLastLessonDate(dayOfWeek)

  return [0, 1, 2].map((weekOffset) => {
    const lessonDate = new Date(lastLessonDate)
    lessonDate.setDate(lessonDate.getDate() - weekOffset * 7)

    const { content, homework } = generateUniqueContent(
      entityId,
      isGroup,
      weekOffset,
    )

    return {
      id: lessonDate.getTime(),
      created_at: new Date(lessonDate.getTime() - 1000 * 60 * 60).toISOString(), // 1 hour before the lesson
      lessonContent: content,
      homework: homework,
      studentId: isGroup ? null : entityId,
      groupId: isGroup ? entityId : null,
      date: lessonDate,
      user_id: user_id,
      homeworkKey: '',
    }
  })
}

// Generate lessons for students
const studentLessons = [
  ...generateLessonsForEntity(BigInt(1), false, 1), // Lisa Müller, Monday
  ...generateLessonsForEntity(BigInt(2), false, 1), // Max Schmidt, Monday
  ...generateLessonsForEntity(BigInt(3), false, 1), // Emma Weber, Monday
  ...generateLessonsForEntity(BigInt(4), false, 3), // Felix Bauer, Wednesday
  ...generateLessonsForEntity(BigInt(5), false, 3), // Sophie Klein, Wednesday
  ...generateLessonsForEntity(BigInt(6), false, 5), // Luca Hoffmann, Friday
  ...generateLessonsForEntity(BigInt(7), false, 5), // Hannah Schulz, Friday
  ...generateLessonsForEntity(BigInt(8), false, 6), // Thomas Wagner, Saturday
]

// Generate lessons for groups
const groupLessons = [
  ...generateLessonsForEntity(BigInt(1), true, 1), // Anfänger Posaunengruppe, Monday
  ...generateLessonsForEntity(BigInt(2), true, 3), // Fortgeschrittene Posaunenspieler, Wednesday
  ...generateLessonsForEntity(BigInt(3), true, 6), // Posaunenchor der Gemeinde, Saturday
]

export const mockLast3Lessons: Lesson[] = [...studentLessons, ...groupLessons]
