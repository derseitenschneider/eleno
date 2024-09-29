import type { Lesson, Weekday } from '@/types/types'

const user_id = 'mock-user-123456'
const now = new Date()

function getLastLessonDate(dayOfWeek: Weekday) {
  const days: Array<Weekday> = [
    'Sonntag',
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag',
  ]
  const dayIndex = days.indexOf(dayOfWeek)
  const today = now.getDay()
  const daysUntilLastLesson = (today - dayIndex + 7) % 7
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - daysUntilLastLesson,
  )
}

const mockLast3Lessons: Array<Lesson> = [
  // Lisa Müller
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 1001,
    studentId: 1,
    homeworkKey: '',
    lessonContent: `
      Fokus auf "Hotel California":
      <ul>
        <li>Wiederholung der Akkordfolge Am, E, G, D, F, C, Dm, E</li>
        <li>Einführung des <b>Zupfmusters</b> für die Strophe</li>
      </ul>
      <i>Fortschritt: Verbesserung in der Akkordwechsel-Geschwindigkeit</i>
    `,
    homework: `
      <ol>
        <li>Übe die Akkordfolge von "Hotel California" täglich für 15 Minuten</li>
        <li>Konzentriere dich besonders auf den <b>flüssigen Wechsel</b> zwischen F und C</li>
        <li>Versuche, das Zupfmuster langsam zur Akkordfolge zu spielen</li>
      </ol>
    `,
    date: getLastLessonDate('Montag'),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 1002,
    studentId: 1,
    homeworkKey: '',
    lessonContent: `
      Fortsetzung "Hotel California" und Einführung "Blackbird":
      <ul>
        <li>Verfeinerung des Zupfmusters für "Hotel California"</li>
        <li>Beginn mit dem <b>Fingerpicking-Intro</b> von "Blackbird"</li>
      </ul>
      <i>Beobachtung: Fortschritte beim Zupfen, noch Übung in Koordination nötig</i>
    `,
    homework: `
      <ol>
        <li>Spiele die ersten vier Takte von "Hotel California" mit Zupfmuster, 10 Minuten täglich</li>
        <li>Übe das Fingerpicking-Intro von "Blackbird" sehr langsam, fokussiere auf saubere Töne</li>
      </ol>
    `,
    date: new Date(
      getLastLessonDate('Montag').getTime() - 7 * 24 * 60 * 60 * 1000,
    ),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 1003,
    studentId: 1,
    homeworkKey: '',
    lessonContent: `
      Einführung "Hotel California":
      <ul>
        <li>Vorstellung der Grundakkorde für "Hotel California"</li>
        <li>Üben der <b>Akkordwechsel</b>, besonders Am zu E und F zu C</li>
      </ul>
      <i>Notiz: Interesse an Fingerstyle, mögliche zukünftige Einführung von "Blackbird"</i>
    `,
    homework: `
      <ol>
        <li>Übe die Akkordfolge Am, E, G, D, F, C, Dm, E langsam und präzise</li>
        <li>Konzentriere dich auf <b>saubere Akkordwechsel</b>, besonders bei F und C</li>
        <li>Spiele jeden Akkordwechsel 10 Mal hintereinander</li>
      </ol>
    `,
    date: new Date(
      getLastLessonDate('Montag').getTime() - 14 * 24 * 60 * 60 * 1000,
    ),
  }, // Max Schmidt (E-Gitarre)
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 2001,
    studentId: 2,
    homeworkKey: '',
    lessonContent: `
      Fokus auf "Smells Like Teen Spirit":
      <ul>
        <li>Verfeinerung des <b>Palm Muting</b> im Hauptriff</li>
        <li>Üben der Powerchord-Wechsel im Refrain</li>
      </ul>
      <i>Fortschritt: Deutliche Verbesserung im Rhythmusgefühl</i>
    `,
    homework: `
      <ol>
        <li>Übe das Hauptriff mit Palm Muting, 20 Minuten täglich</li>
        <li>Arbeite an den schnellen Powerchord-Wechseln im Refrain</li>
      </ol>
    `,
    date: getLastLessonDate('Montag'),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 2002,
    studentId: 2,
    homeworkKey: '',
    lessonContent: 'Absenz (Krankheit)',
    homework: '',
    date: new Date(
      getLastLessonDate('Montag').getTime() - 7 * 24 * 60 * 60 * 1000,
    ),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 2003,
    studentId: 2,
    homeworkKey: '',
    lessonContent: `
      Einführung "Sweet Child O' Mine":
      <ul>
        <li>Erarbeitung des charakteristischen <b>Intro-Riffs</b></li>
        <li>Übung der Bendings im Solo-Teil</li>
      </ul>
      <i>Beobachtung: Gute Fingerfertigkeit, Timing noch verbesserungswürdig</i>
    `,
    homework: `
      <ol>
        <li>Übe das Intro-Riff langsam und steigere das Tempo, 15 Minuten täglich</li>
        <li>Experimentiere mit verschiedenen Bending-Techniken</li>
      </ol>
    `,
    date: new Date(
      getLastLessonDate('Montag').getTime() - 14 * 24 * 60 * 60 * 1000,
    ),
  },

  // Emma Weber (Ukulele)
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 3001,
    studentId: 3,
    homeworkKey: '',
    lessonContent: `
      Fortschritt mit "Somewhere Over the Rainbow":
      <ul>
        <li>Verfeinerung des <b>Fingerpicking-Patterns</b></li>
        <li>Arbeit an der Gesangsbegleitung</li>
      </ul>
      <i>Notiz: Emmas Timing hat sich deutlich verbessert</i>
    `,
    homework: `
      <ol>
        <li>Übe das Fingerpicking-Pattern ohne Unterbrechungen, 10 Minuten täglich</li>
        <li>Versuche, die ersten zwei Zeilen zu singen und zu spielen</li>
      </ol>
    `,
    date: getLastLessonDate('Montag'),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 3002,
    studentId: 3,
    homeworkKey: '',
    lessonContent: `
      Einführung "I'm Yours":
      <ul>
        <li>Vorstellung des <b>Strumming-Patterns</b></li>
        <li>Üben der Akkordwechsel G, D, Em, C</li>
      </ul>
      <i>Beobachtung: Emma zeigt Talent für rhythmisches Spiel</i>
    `,
    homework: `
      <ol>
        <li>Übe das Strumming-Pattern von "I'm Yours", 15 Minuten täglich</li>
        <li>Konzentriere dich auf flüssige Akkordwechsel</li>
      </ol>
    `,
    date: new Date(
      getLastLessonDate('Montag').getTime() - 7 * 24 * 60 * 60 * 1000,
    ),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 3003,
    studentId: 3,
    homeworkKey: '',
    lessonContent: 'Absenz (Familienurlaub)',
    homework: '',
    date: new Date(
      getLastLessonDate('Montag').getTime() - 14 * 24 * 60 * 60 * 1000,
    ),
  },

  // Felix Bauer (Gitarre)
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 4001,
    studentId: 4,
    homeworkKey: '',
    lessonContent: `
      Fortgeschrittene Arbeit an "Asturias":
      <ul>
        <li>Fokus auf den <b>Tremolo-Abschnitt</b></li>
        <li>Verfeinerung der Dynamik im Stück</li>
      </ul>
      <i>Fortschritt: Felix' Tremolo-Technik zeigt große Verbesserung</i>
    `,
    homework: `
      <ol>
        <li>Übe den Tremolo-Abschnitt mit Metronom, beginne langsam</li>
        <li>Arbeite an der Dynamik im ersten Teil des Stücks</li>
      </ol>
    `,
    date: getLastLessonDate('Mittwoch'),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 4002,
    studentId: 4,
    homeworkKey: '',
    lessonContent: `
      Einführung "Recuerdos de la Alhambra":
      <ul>
        <li>Erklärung der <b>Tremolo-Technik</b></li>
        <li>Langsames Üben der rechten Hand</li>
      </ul>
      <i>Beobachtung: Felix zeigt großes Interesse an der Herausforderung</i>
    `,
    homework: `
      <ol>
        <li>Übe die Tremolo-Technik auf einer Saite, 10 Minuten täglich</li>
        <li>Spiele die ersten vier Takte sehr langsam</li>
      </ol>
    `,
    date: new Date(
      getLastLessonDate('Mittwoch').getTime() - 7 * 24 * 60 * 60 * 1000,
    ),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 4003,
    studentId: 4,
    homeworkKey: '',
    lessonContent: `
      Abschluss "Classical Gas":
      <ul>
        <li>Feinschliff der <b>schnellen Läufe</b></li>
        <li>Arbeit an der Gesamtinterpretation</li>
      </ul>
      <i>Notiz: Beeindruckende Fortschritte in technischer Präzision</i>
    `,
    homework: `
      <ol>
        <li>Spiele "Classical Gas" einmal täglich komplett durch</li>
        <li>Nimm dich beim Spielen auf und analysiere deine Interpretation</li>
      </ol>
    `,
    date: new Date(
      getLastLessonDate('Mittwoch').getTime() - 14 * 24 * 60 * 60 * 1000,
    ),
  },

  // Sophie Klein (E-Gitarre)
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 5001,
    studentId: 5,
    homeworkKey: '',
    lessonContent: `
      Vertiefung "Sultans of Swing":
      <ul>
        <li>Arbeit am <b>Fingerpicking-Solo</b></li>
        <li>Verfeinerung der Phrasierung</li>
      </ul>
      <i>Fortschritt: Sophie zeigt beeindruckende Fingerfertigkeit</i>
    `,
    homework: `
      <ol>
        <li>Übe das Solo in kleinen Abschnitten, 20 Minuten täglich</li>
        <li>Arbeite an der Phrasierung und dem Feeling des Solos</li>
      </ol>
    `,
    date: getLastLessonDate('Mittwoch'),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 5002,
    studentId: 5,
    homeworkKey: '',
    lessonContent: 'Absenz (Schulveranstaltung)',
    homework: '',
    date: new Date(
      getLastLessonDate('Mittwoch').getTime() - 7 * 24 * 60 * 60 * 1000,
    ),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 5003,
    studentId: 5,
    homeworkKey: '',
    lessonContent: `
      Einführung "Back in Black":
      <ul>
        <li>Erarbeitung des markanten <b>Riffs</b></li>
        <li>Übung der Powerchord-Technik</li>
      </ul>
      <i>Beobachtung: Sophie hat ein natürliches Gefühl für Rockrhythmen</i>
    `,
    homework: `
      <ol>
        <li>Übe das Hauptriff von "Back in Black", 15 Minuten täglich</li>
        <li>Arbeite an der Präzision der Powerchords</li>
      </ol>
    `,
    date: new Date(
      getLastLessonDate('Mittwoch').getTime() - 14 * 24 * 60 * 60 * 1000,
    ),
  }, // Band "The Dizzy Rascals"
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 6001,
    groupId: 1,
    homeworkKey: '',
    lessonContent: `
      Probe "Born to Be Wild":
      <ul>
        <li>Fokus auf <b>Zusammenspiel</b> und Timing</li>
        <li>Arbeit an den Übergängen zwischen Strophe und Refrain</li>
      </ul>
      <i>Fortschritt: Die Band entwickelt einen guten Groove</i>
    `,
    homework: `
      <ol>
        <li>Jedes Mitglied übt seinen Part für "Born to Be Wild"</li>
        <li>Gitarristen arbeiten am Solo, Bassist am Walking Bass</li>
      </ol>
    `,
    date: getLastLessonDate('Montag'),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 6002,
    groupId: 1,
    homeworkKey: '',
    lessonContent: `
      Einführung "All Right Now":
      <ul>
        <li>Vorstellung der <b>Songstruktur</b> und Einzelparts</li>
        <li>Gemeinsames Erarbeiten des Refrains</li>
      </ul>
      <i>Beobachtung: Gute Energie, Timing noch verbesserungswürdig</i>
    `,
    homework: `
      <ol>
        <li>Hört euch das Original mehrmals an</li>
        <li>Übt eure individuellen Parts, besonders den Refrain</li>
      </ol>
    `,
    date: new Date(
      getLastLessonDate('Montag').getTime() - 7 * 24 * 60 * 60 * 1000,
    ),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 6003,
    groupId: 1,
    homeworkKey: '',
    lessonContent: `
      Verfeinerung "Jumpin' Jack Flash":
      <ul>
        <li>Arbeit an der <b>Dynamik</b> des Songs</li>
        <li>Üben der Backing Vocals</li>
      </ul>
      <i>Notiz: Die Band macht Fortschritte im Zusammenspiel</i>
    `,
    homework: `
      <ol>
        <li>Gitarristen üben die Riffs mit korrektem Timing</li>
        <li>Sänger und Backing Vocals proben die Harmonien</li>
      </ol>
    `,
    date: new Date(
      getLastLessonDate('Montag').getTime() - 14 * 24 * 60 * 60 * 1000,
    ),
  },

  // Gitarrenensemble
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 7001,
    groupId: 2,
    homeworkKey: '',
    lessonContent: `
      Probe "Prelude in D minor (Bach)":
      <ul>
        <li>Fokus auf <b>präzise Artikulation</b></li>
        <li>Abstimmung der Dynamik zwischen den Stimmen</li>
      </ul>
      <i>Fortschritt: Das Ensemble zeigt verbesserte Koordination</i>
    `,
    homework: `
      <ol>
        <li>Übt eure individuellen Stimmen mit Metronom</li>
        <li>Achtet besonders auf die Übergänge zwischen den Phrasen</li>
      </ol>
    `,
    date: getLastLessonDate('Mittwoch'),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 7002,
    groupId: 2,
    homeworkKey: '',
    lessonContent: 'Absenz (Mehrere Mitglieder krank)',
    homework: '',
    date: new Date(
      getLastLessonDate('Mittwoch').getTime() - 7 * 24 * 60 * 60 * 1000,
    ),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 7003,
    groupId: 2,
    homeworkKey: '',
    lessonContent: `
      Einführung "Cavatina":
      <ul>
        <li>Verteilung der <b>Stimmen</b> auf die Ensemblemitglieder</li>
        <li>Langsames Durchspielen der ersten Sektion</li>
      </ul>
      <i>Beobachtung: Herausforderungen bei der Koordination, aber guter Einsatz</i>
    `,
    homework: `
      <ol>
        <li>Übt eure zugewiesenen Stimmen einzeln</li>
        <li>Hört euch verschiedene Aufnahmen des Stücks an</li>
      </ol>
    `,
    date: new Date(
      getLastLessonDate('Mittwoch').getTime() - 14 * 24 * 60 * 60 * 1000,
    ),
  },

  // Band "Black Ducks"
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 8001,
    groupId: 3,
    homeworkKey: '',
    lessonContent: `
      Probe "Paint It Black":
      <ul>
        <li>Arbeit am <b>charakteristischen Intro</b></li>
        <li>Fokus auf den Groove und die Dynamik des Songs</li>
      </ul>
      <i>Fortschritt: Die Band fängt an, den düsteren Vibe des Songs gut einzufangen</i>
    `,
    homework: `
      <ol>
        <li>Gitarrist und Bassist üben das Intro-Riff bis zur Perfektion</li>
        <li>Schlagzeuger arbeitet am charakteristischen Beat</li>
      </ol>
    `,
    date: getLastLessonDate('Samstag'),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 8002,
    groupId: 3,
    homeworkKey: '',
    lessonContent: `
      Verfeinerung "Back in Black":
      <ul>
        <li>Fokus auf <b>Tight Playing</b> zwischen Gitarre und Bass</li>
        <li>Arbeit an den Gesangsharmonien im Chorus</li>
      </ul>
      <i>Beobachtung: Gute Energie, Timing verbessert sich stetig</i>
    `,
    homework: `
      <ol>
        <li>Gitarrist und Bassist üben zusammen das Hauptriff</li>
        <li>Sänger proben die Harmonien im Refrain</li>
      </ol>
    `,
    date: new Date(
      getLastLessonDate('Samstag').getTime() - 7 * 24 * 60 * 60 * 1000,
    ),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 8003,
    groupId: 3,
    homeworkKey: '',
    lessonContent: `
      Einführung "Black Betty":
      <ul>
        <li>Vorstellung der <b>Songstruktur</b> und des Rhythmus</li>
        <li>Erste Versuche, den Refrain gemeinsam zu spielen</li>
      </ul>
      <i>Notiz: Herausforderungen beim synkopierten Rhythmus, aber großes Potenzial</i>
    `,
    homework: `
      <ol>
        <li>Jedes Mitglied übt seinen Part, besonders den synkopierten Rhythmus</li>
        <li>Hört euch verschiedene Versionen des Songs an</li>
      </ol>
    `,
    date: new Date(
      getLastLessonDate('Samstag').getTime() - 14 * 24 * 60 * 60 * 1000,
    ),
  },

  // Band Sommercamp (archived)
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 9001,
    groupId: 4,
    homeworkKey: '',
    lessonContent: `
      Abschlusskonzert Vorbereitung:
      <ul>
        <li>Durchspielen des gesamten <b>Konzertprogramms</b></li>
        <li>Feinschliff an Übergängen zwischen Songs</li>
      </ul>
      <i>Fortschritt: Die Band ist gut vorbereitet für das Abschlusskonzert</i>
    `,
    homework: `
      <ol>
        <li>Jedes Mitglied übt die schwierigen Stellen in seinen Parts</li>
        <li>Visualisiert das Konzert und bereitet euch mental vor</li>
      </ol>
    `,
    date: new Date(now.getFullYear() - 1, 7, 15), // Letztes Jahr, 15. August
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 9002,
    groupId: 4,
    homeworkKey: '',
    lessonContent: `
      Probe "Here Comes the Sun":
      <ul>
        <li>Arbeit an der <b>Gitarren-Arpeggio-Technik</b></li>
        <li>Üben der Harmonien im Chorus</li>
      </ul>
      <i>Beobachtung: Gute Fortschritte, positive Stimmung in der Gruppe</i>
    `,
    homework: `
      <ol>
        <li>Gitarristen üben das Arpeggio-Pattern</li>
        <li>Alle: Hört euch das Original an und achtet auf die Feinheiten</li>
      </ol>
    `,
    date: new Date(now.getFullYear() - 1, 7, 8), // Letztes Jahr, 8. August
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 9003,
    groupId: 4,
    homeworkKey: '',
    lessonContent: `
      Einführung "Sunny Afternoon":
      <ul>
        <li>Vorstellung der <b>Songstruktur</b> und des Textes</li>
        <li>Erste Versuche, den Refrain gemeinsam zu spielen</li>
      </ul>
      <i>Notiz: Enthusiasmus in der Gruppe, guter Start in das Camp</i>
    `,
    homework: `
      <ol>
        <li>Lernt den Text der ersten Strophe und des Refrains</li>
        <li>Bassisten und Gitarristen üben die Akkordprogressionen</li>
      </ol>
    `,
    date: new Date(now.getFullYear() - 1, 7, 1), // Letztes Jahr, 1. August
  }, // Luca Hoffmann (Gitarre)
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 10001,
    studentId: 6,
    homeworkKey: '',
    lessonContent: `
      Fortschritt mit Fingerstyle-Technik:
      <ul>
        <li>Verfeinerung des <b>Travis-Picking</b> in "Dust in the Wind"</li>
        <li>Arbeit an der Koordination zwischen Daumen und Fingern</li>
      </ul>
      <i>Notiz: Luca zeigt deutliche Verbesserung in der Fingerfertigkeit</i>
    `,
    homework: `
      <ol>
        <li>Übe das Travis-Picking-Pattern 15 Minuten täglich</li>
        <li>Spiele die erste Strophe von "Dust in the Wind" langsam und präzise</li>
      </ol>
    `,
    date: getLastLessonDate('Freitag'),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 10002,
    studentId: 6,
    homeworkKey: '',
    lessonContent: `Absenz (Schulausflug)`,
    homework: '',
    date: new Date(
      getLastLessonDate('Freitag').getTime() - 7 * 24 * 60 * 60 * 1000,
    ),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 10003,
    studentId: 6,
    homeworkKey: '',
    lessonContent: `
      Einführung in Barre-Akkorde:
      <ul>
        <li>Erklärung der <b>Barre-Technik</b> am Beispiel von F-Dur</li>
        <li>Übungen zur Handpositionierung und Druckanwendung</li>
      </ul>
      <i>Beobachtung: Anfängliche Schwierigkeiten, aber gute Motivation</i>
    `,
    homework: `
      <ol>
        <li>Übe den F-Dur Barre-Akkord, 10 Minuten täglich</li>
        <li>Versuche, zwischen C, G und F-Dur zu wechseln</li>
      </ol>
    `,
    date: new Date(
      getLastLessonDate('Freitag').getTime() - 14 * 24 * 60 * 60 * 1000,
    ),
  },

  // Hannah Schulz (Ukulele)
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 11001,
    studentId: 7,
    homeworkKey: '',
    lessonContent: `
      Fortgeschrittenes Strumming für "Count on Me":
      <ul>
        <li>Einführung komplexerer <b>Strumming-Patterns</b></li>
        <li>Übung des Wechsels zwischen Zupfen und Schlagen</li>
      </ul>
      <i>Fortschritt: Hannah entwickelt ein gutes Gefühl für Rhythmus</i>
    `,
    homework: `
      <ol>
        <li>Übe das neue Strumming-Pattern für "Count on Me", 15 Minuten täglich</li>
        <li>Versuche, Text und Strumming gleichzeitig zu koordinieren</li>
      </ol>
    `,
    date: getLastLessonDate('Freitag'),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 11002,
    studentId: 7,
    homeworkKey: '',
    lessonContent: `
      Einführung einfacher Melodiespiel:
      <ul>
        <li>Erklärung der <b>Einzelton-Technik</b> auf der Ukulele</li>
        <li>Üben der Melodie von "Ode an die Freude"</li>
      </ul>
      <i>Beobachtung: Hannah zeigt Interesse an der neuen Spieltechnik</i>
    `,
    homework: `
      <ol>
        <li>Übe die ersten vier Takte der Melodie von "Ode an die Freude"</li>
        <li>Spiele jeden Ton sauber und deutlich, achte auf die Rhythmik</li>
      </ol>
    `,
    date: new Date(
      getLastLessonDate('Freitag').getTime() - 7 * 24 * 60 * 60 * 1000,
    ),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 11003,
    studentId: 7,
    homeworkKey: '',
    lessonContent: `
      Verfeinerung "I'm Yours":
      <ul>
        <li>Arbeit an der <b>Dynamik</b> und dem Gefühl des Songs</li>
        <li>Einführung einfacher Verzierungen (Slides, Hammer-ons)</li>
      </ul>
      <i>Notiz: Hannahs Timing hat sich deutlich verbessert</i>
    `,
    homework: `
      <ol>
        <li>Spiele "I'm Yours" täglich durch, konzentriere dich auf die Dynamik</li>
        <li>Übe die neuen Verzierungen in langsamem Tempo</li>
      </ol>
    `,
    date: new Date(
      getLastLessonDate('Freitag').getTime() - 14 * 24 * 60 * 60 * 1000,
    ),
  },

  // Thomas Wagner (E-Gitarre)
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 12001,
    studentId: 8,
    homeworkKey: '',
    lessonContent: `
      Vertiefung Pentatonik-Skala:
      <ul>
        <li>Erweiterung der <b>Pentatonik-Positionen</b> auf dem Griffbrett</li>
        <li>Übung von Licks in verschiedenen Positionen</li>
      </ul>
      <i>Fortschritt: Thomas zeigt wachsendes Verständnis für Skalenmuster</i>
    `,
    homework: `
      <ol>
        <li>Übe die Pentatonik-Skala in der 2. und 3. Position, je 10 Minuten</li>
        <li>Versuche, einfache Licks zwischen den Positionen zu verbinden</li>
      </ol>
    `,
    date: getLastLessonDate('Samstag'),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 12002,
    studentId: 8,
    homeworkKey: '',
    lessonContent: `
      Arbeit an "Sweet Child O' Mine":
      <ul>
        <li>Fokus auf das <b>charakteristische Intro-Riff</b></li>
        <li>Einführung in die Verwendung von Delay-Effekten</li>
      </ul>
      <i>Beobachtung: Thomas hat das Riff schnell begriffen, Timing noch verbesserungswürdig</i>
    `,
    homework: `
      <ol>
        <li>Übe das Intro-Riff von "Sweet Child O' Mine" täglich für 20 Minuten</li>
        <li>Experimentiere mit verschiedenen Delay-Einstellungen</li>
      </ol>
    `,
    date: new Date(
      getLastLessonDate('Samstag').getTime() - 7 * 24 * 60 * 60 * 1000,
    ),
  },
  {
    created_at: new Date().toISOString(),
    user_id,
    id: 12003,
    studentId: 8,
    homeworkKey: '',
    lessonContent: `
      Einführung Powerchords und Palm Muting:
      <ul>
        <li>Erklärung der <b>Powerchord-Struktur</b> und -Fingersetzung</li>
        <li>Übung von Palm Muting am Beispiel von "Smells Like Teen Spirit"</li>
      </ul>
      <i>Notiz: Thomas ist begeistert von den neuen Techniken</i>
    `,
    homework: `
      <ol>
        <li>Übe Powerchords in verschiedenen Positionen auf dem Griffbrett</li>
        <li>Arbeite am Palm Muting mit offener E-Saite, 15 Minuten täglich</li>
      </ol>
    `,
    date: new Date(
      getLastLessonDate('Samstag').getTime() - 14 * 24 * 60 * 60 * 1000,
    ),
  },
]

export default mockLast3Lessons
