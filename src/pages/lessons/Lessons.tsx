import { FunctionComponent, useEffect, useState } from 'react'
import { TStudent, TLesson } from '../../types/types'
import { useStudents } from '../../contexts/StudentContext'
import { useLessons } from '../../contexts/LessonsContext'
import { useLoading } from '../../contexts/LoadingContext'
import Button from '../../components/button/Button.component'
import {
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoPersonCircleOutline,
} from 'react-icons/io5'
import './lessons.style.scss'
import { compareDateString } from '../../utils/sortStudents'
import { postLesson } from '../../supabase/supabase'

import {
  formatDateToDisplay,
  formatDateToDatabase,
} from '../../utils/formateDate'
import { toast } from 'react-toastify'

const lessonData: TLesson = {
  date: '',
  homework: '',
  studentId: 0,
  lessonContent: '',
}

interface LessonProps {}

const Lesson: FunctionComponent<LessonProps> = () => {
  const { loading } = useLoading()
  const [date, setDate] = useState<string>('')
  const { lessons, setLessons } = useLessons()
  const { students } = useStudents()
  const [activeStudents, setActiveStudents] = useState<TStudent[]>(students)
  const [studentIndex, setStudentIndex] = useState(0)

  const [currentStudent, setCurrentStudent] = useState<TStudent>(null)
  const [currentLessons, setCurrentLessons] = useState<TLesson[]>([])

  const [previousLesson, setPreviousLesson] = useState<TLesson>()

  const [inputNewLesson, setInputNewLesson] = useState<TLesson>(lessonData)

  //EFFECTS

  useEffect(() => {
    const today = new Date()
      .toLocaleDateString('de-CH')
      .split('.')
      .map((e) => e.padStart(2, '0'))
      .join('.')
    console.log(typeof today)
    setDate(today)
  }, [])

  useEffect(() => {
    students &&
      setActiveStudents(students.filter((student) => !student.archive))
  }, [students])

  useEffect(() => {
    activeStudents && setCurrentStudent(activeStudents[studentIndex])
  }, [activeStudents, studentIndex])

  useEffect(() => {
    currentStudent &&
      setCurrentLessons(
        lessons.filter((lesson) => lesson.studentId === currentStudent.id)
      )
  }, [currentStudent, lessons])

  useEffect(() => {
    currentLessons &&
      setPreviousLesson(currentLessons[currentLessons.length - 1])
  }, [currentLessons, lessons])

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

  const handlerInputDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDate(value)
  }

  console.log(date)

  const handlerSaveLesson = () => {
    console.log(date)
    const tempID = Math.floor(Math.random() * 10000000)
    const newLesson: TLesson = {
      ...inputNewLesson,
      studentId: currentStudent.id,
      date: formatDateToDatabase(date),
      id: tempID,
    }

    // const tempNewLessons: TLesson[] = [...lessons, newLesson]
    setLessons((lessons) => [...lessons, newLesson])

    const postNewLesson = async () => {
      const [data] = await postLesson(newLesson)
      const newId = data.id
      // console.log(data.id)

      setLessons((lessons) => {
        const newLessonsArray = lessons.map((lesson) =>
          lesson.id === tempID ? { ...lesson, id: newId } : lesson
        )
        return newLessonsArray
      })
    }
    postNewLesson()
    setInputNewLesson(lessonData)
    toast('Lektion gespeichert')
  }
  return (
    <>
      {loading && <p>loading</p>}
      {currentStudent ? (
        <header className="container container--header">
          <div className="container--infos">
            <div className="row-1">
              <div className="student-name">
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
      {previousLesson ? (
        <div className="container container--lessons">
          <h5 className="heading-5">
            Letzte Lektion: {formatDateToDisplay(previousLesson.date)}
          </h5>
          <div className="container--two-rows">
            <div className="row-left">
              <h4 className="heading-4">Lektion</h4>
              <textarea value={previousLesson.lessonContent} />
            </div>
            <div className="row-right">
              <h4 className="heading-4">Hausaufgaben</h4>
              <textarea value={previousLesson.homework} />
            </div>
          </div>
        </div>
      ) : null}

      <div className="container container--lessons container--new-lesson">
        <h3 className="heading-3">
          Aktuelle Lektion
          <span>
            <input type="text" value={date} onChange={handlerInputDate} />
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
