import { FunctionComponent, useEffect, useState } from 'react'
import { TStudent, TLesson } from '../../types/types'
import { useStudents } from '../../contexts/StudentContext'
import { useLessons } from '../../contexts/LessonsContext'
import Button from '../../components/button/Button.component'
import {
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoPersonCircleOutline,
} from 'react-icons/io5'
import './lessons.style.scss'
import { compareDateString } from '../../utils/sortStudents'
import { postLesson } from '../../supabase/supabase'

const lessonData: TLesson = {
  date: '',
  homework: '',
  studentId: 0,
  lessonContent: '',
}

interface LessonProps {}

const Lesson: FunctionComponent<LessonProps> = () => {
  const { lessons, setLessons } = useLessons()
  const { students } = useStudents()
  const [activeStudents, setActiveStudents] = useState<TStudent[]>(students)
  const [studentIndex, setStudentIndex] = useState(0)
  const [dateOfLesson, setdateOfLesson] = useState('')

  const [currentStudent, setCurrentStudent] = useState<TStudent>(null)
  const [currentLessons, setCurrentLessons] = useState<TLesson[]>([])

  const [inputNewLesson, setInputNewLesson] = useState<TLesson>(lessonData)

  //EFFECTS

  useEffect(() => {
    const today = new Date().toLocaleDateString('de-DE')
    setdateOfLesson(today)
  }, [])
  useEffect(() => {
    setActiveStudents(students?.filter((student) => !student.archive))
  }, [students])

  useEffect(() => {
    setCurrentStudent(activeStudents[studentIndex])
  }, [activeStudents, studentIndex])

  useEffect(() => {
    const currentLessons = lessons?.filter(
      (lesson) => lesson?.studentId === currentStudent?.id
    )

    const currentLessonsSorted = currentLessons.sort(compareDateString)
    setCurrentLessons(currentLessonsSorted)
  }, [])

  // HANDLER
  const handlerNextStudent = () => {
    studentIndex < activeStudents.length - 1
      ? setStudentIndex(studentIndex + 1)
      : setStudentIndex(0)
  }

  const handlerPreviousStudent = () => {
    studentIndex > 0
      ? setStudentIndex(studentIndex - 1)
      : setStudentIndex(activeStudents.length - 1)
  }

  const handlerInputNewLesson = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const name = e.target.name
    const value = e.target.value
    const newInput = { ...inputNewLesson, [name]: value }
    setInputNewLesson(newInput)
  }

  const handlerSaveLesson = () => {
    const tempId = Math.floor(Math.random() * 10000000)
    const lessonToSave: TLesson = {
      ...inputNewLesson,
      studentId: currentStudent.id,
      date: dateOfLesson,
    }
    const newLessons = [...currentLessons, { ...lessonToSave, id: tempId }]
    setCurrentLessons(newLessons)
    const postAndFetchLesson = async () => {
      const [data] = await postLesson(lessonToSave)
      const tempLessons = currentLessons.map((lesson) =>
        lesson.id === tempId ? { ...lesson, id: data.id } : lesson
      )
      setCurrentLessons(tempLessons)
    }
    postAndFetchLesson()
  }

  console.log(currentLessons)

  return (
    <>
      {currentStudent ? (
        <header className="container container--header">
          <div className="container--infos">
            <div className="row-1">
              <div className="student-name">
                {' '}
                <IoPersonCircleOutline className="icon" />
                {currentStudent.firstName} {currentStudent.lastName}
              </div>

              <span> {currentStudent.durationMinutes} Minuten</span>
            </div>
            <p>
              {currentStudent.dayOfLesson} {currentStudent.startOfLesson} -{' '}
              {currentStudent.endOfLesson}
            </p>
          </div>
          <div className="container--buttons">
            <Button
              type="button"
              btnStyle="primary"
              handler={handlerPreviousStudent}
              icon={<IoArrowBackOutline />}
            />
            <Button
              type="button"
              btnStyle="primary"
              handler={handlerNextStudent}
              icon={<IoArrowForwardOutline />}
            />
          </div>
        </header>
      ) : null}
      {currentLessons.length ? (
        <div className="container container--lessons">
          <h5 className="heading-5">
            Letzte Lektion: {currentLessons[currentLessons.length - 1].date}
          </h5>
          <div className="container--two-rows">
            <div className="row-left">
              <h4 className="heading-4">Lektion</h4>
              <textarea>
                {currentLessons[currentLessons.length - 1].lessonContent}
              </textarea>
            </div>
            <div className="row-right">
              <h4 className="heading-4">Hausaufgaben</h4>
              <textarea>
                {currentLessons[currentLessons.length - 1].homework}
              </textarea>
            </div>
          </div>
        </div>
      ) : null}

      <div className="container container--lessons container--new-lesson">
        <h3 className="heading-3">
          Aktuelle Lektion{' '}
          <span>
            <input type="text" value={dateOfLesson} />
          </span>
        </h3>
        <div className="container--two-rows">
          <div className="row-left">
            <h4 className="heading-4">Lektion</h4>
            <textarea
              name="lessonContent"
              autoFocus
              value={inputNewLesson.lessonContent}
              onChange={handlerInputNewLesson}
            ></textarea>
          </div>
          <div className="row-right">
            <h4 className="heading-4">Hausaufgaben</h4>
            <textarea
              name="homework"
              value={inputNewLesson.homework}
              onChange={handlerInputNewLesson}
            ></textarea>
          </div>
        </div>
        <Button
          type="button"
          btnStyle="primary"
          label="Speichern"
          className="btn--save"
          handler={handlerSaveLesson}
        />
      </div>
    </>
  )
}

export default Lesson
