import { TLesson } from '../../types/types'

const currentDate = new Date()
const currentDay = currentDate.getDay()
let minusOperant: number

switch (currentDay) {
  case 0:
    minusOperant = 6
    break
  case 1:
    minusOperant = 7
    break
  case 2:
    minusOperant = 1
    break
  case 3:
    minusOperant = 2
    break
  case 4:
    minusOperant = 3
    break
  case 5:
    minusOperant = 4
    break
  case 6:
    minusOperant = 5
    break
  default:
    minusOperant = 7
}

const mockLessons: TLesson[] = [
  {
    lessonContent: '- Aufwärmen \n - Buch S. 23, Lied 14',
    id: 1,
    date: new Date(
      currentDate.getTime() - minusOperant * 5 * 24 * 60 * 60 * 1000,
    )
      .toISOString()
      .split('T')[0],
    studentId: 1,
    homework: '- Tonleiter üben \n - Buch S. 23, Lied 15',
  },
  {
    lessonContent:
      '- Aufwärmen \n - Buch S. 22, Lied 12 repetiert \n - Handhaltung C-Dur Tonleiter angeschaut \n - Hausaufgaben besprochen',
    id: 2,
    date: new Date(
      currentDate.getTime() - minusOperant * 4 * 24 * 60 * 60 * 1000,
    )
      .toISOString()
      .split('T')[0],
    studentId: 1,
    homework: '- Tonleiter üben \n - Buch S. 23, Lied 15 repetieren',
  },
  {
    lessonContent:
      '- Aufwärmen \n - Kleines Spiel mit Handhaltung C-Dur Tonleiter  - Buch s. 23, Lied 16',
    id: 3,
    date: new Date(
      currentDate.getTime() - (minusOperant + 0.75) * 3 * 24 * 60 * 60 * 1000,
    )
      .toISOString()
      .split('T')[0],
    studentId: 1,
    homework: '- Tonleiter üben \n - Buch S. 23, Lied 15',
  },
  {
    lessonContent: 'Absenz (krank)',
    id: 4,
    date: new Date(
      currentDate.getTime() - (minusOperant + 0.5) * 2 * 24 * 60 * 60 * 1000,
    )
      .toISOString()
      .split('T')[0],
    studentId: 1,
    homework: '',
  },
  {
    lessonContent:
      "- Aufwärmen \n - Buch S. 23, Lied 15 abgeschlossen \n - Neuer Ton e' ",
    id: 5,
    date: new Date(
      currentDate.getTime() - minusOperant * 1 * 24 * 60 * 60 * 1000,
    )
      .toISOString()
      .split('T')[0],
    studentId: 1,
    homework: '- Tonleiter üben \n - Buch S. 23, Lied 15',
  },
]

export default mockLessons
