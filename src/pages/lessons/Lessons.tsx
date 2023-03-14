import './lessons.style.scss'

// React
import { FunctionComponent, useEffect, useState } from 'react'

// Types
import { TStudent, TLesson, TNotes } from '../../types/types'

// Contexts
import { useStudents } from '../../contexts/StudentContext'
import { useLessons } from '../../contexts/LessonsContext'
import { useNotes } from '../../contexts/NotesContext'
import { useLoading } from '../../contexts/LoadingContext'

// Components
import Button from '../../components/button/Button.component'
import Modal from '../../components/modals/modal.component'
import {
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoPersonCircleOutline,
  IoTrashOutline,
  IoAddOutline,
  IoClose,
} from 'react-icons/io5'

import { HiPencilSquare } from 'react-icons/hi2'

// Functions

import {
  formatDateToDisplay,
  formatDateToDatabase,
} from '../../utils/formateDate'
import { sortStudentsDateTime } from '../../utils/sortStudents'
import { toast } from 'react-toastify'

import {
  postLesson,
  deleteLessonSupabase,
} from '../../supabase/lessons/lessons.supabase'

import {
  postNotes,
  deleteNoteSupabase,
} from '../../supabase/notes/notes.supabase'
import { useClosestStudent } from '../../contexts/ClosestStudentContext'

const lessonData: TLesson = {
  date: '',
  homework: '',
  studentId: 0,
  lessonContent: '',
}

const noteData: TNotes = {
  title: '',
  text: '',
  studentId: 0,
}

interface LessonProps {}

const Lesson: FunctionComponent<LessonProps> = () => {
  const { loading } = useLoading()
  const [date, setDate] = useState<string>('')
  const { lessons, setLessons } = useLessons()
  const { students } = useStudents()
  const { notes, setNotes } = useNotes()
  const [activeStudents, setActiveStudents] = useState<TStudent[]>(students)

  const [currentStudent, setCurrentStudent] = useState<TStudent>(null)
  const [currentLessons, setCurrentLessons] = useState<TLesson[]>([])
  const [currentNotes, setCurrentNotes] = useState<TNotes[]>([])

  const [previousLesson, setPreviousLesson] = useState<TLesson>()
  const [prePreviousLesson, setPrePreviousLesson] = useState<TLesson>()
  const [lastBut2Lesson, setLastBut2Lesson] = useState<TLesson>()
  const [tabIndex, setTabIndex] = useState(0)

  const [inputNewLesson, setInputNewLesson] = useState<TLesson>(lessonData)

  const [modalEditOpen, setModalEditOpen] = useState(false)
  const [modalNotesOpen, setModalNotesOpen] = useState(false)

  const [newNoteInput, setNewNoteInput] = useState(noteData)

  const { closestStudentIndex } = useClosestStudent()
  const [studentIndex, setStudentIndex] = useState(0)

  //EFFECTS
  // [ ] get rid of effects -> change them to memo or none

  useEffect(() => {
    setStudentIndex(closestStudentIndex)
  }, [closestStudentIndex])

  useEffect(() => {
    const today = new Date()
      .toLocaleDateString('de-CH')
      .split('.')
      .map((e) => e.padStart(2, '0'))
      .join('.')
    setDate(today)
  }, [])

  useEffect(() => {
    if (students) {
      const activeStudents = students.filter((student) => !student.archive)
      const sortedStudents = sortStudentsDateTime(activeStudents)
      setActiveStudents(sortedStudents)
    }
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
    if (currentLessons) {
      setPreviousLesson(currentLessons[currentLessons.length - 1])
      setPrePreviousLesson(currentLessons[currentLessons.length - 2])
      setLastBut2Lesson(currentLessons[currentLessons.length - 3])
    }
  }, [currentLessons, lessons])

  useEffect(() => {
    currentStudent &&
      setCurrentNotes(
        notes.filter((note) => note.studentId === currentStudent.id)
      )
  }, [currentStudent, notes])

  // HANDLER
  // [ ] save input befor change if not empty
  const handlerNextStudent = () => {
    setTabIndex(0)
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

  // [ ] no save when fields are empty
  const handlerSaveLesson = () => {
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

  const handlerInputNote = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name
    const value = e.target.value
    const tempNewNoteInput = { ...newNoteInput, [name]: value }
    setNewNoteInput(tempNewNoteInput)
  }

  const saveNote = () => {
    const tempID = Math.floor(Math.random() * 10000000)
    const newNote = { ...newNoteInput, studentId: currentStudent.id }
    const tempNotes: TNotes[] = [...notes, { ...newNote, id: tempID }]
    setNotes(tempNotes)
    setNewNoteInput(noteData)
    setModalNotesOpen(false)
    const postData = async () => {
      const [data] = await postNotes(newNote, currentStudent.id)
      setNotes((notes) =>
        notes.map((note) =>
          note.id === tempID ? { ...note, id: data.id } : note
        )
      )
    }
    postData()
    toast('Notiz gespeichert')
  }

  const deleteNote = (e: React.MouseEvent) => {
    const target = e.target as Element
    const currNoteId = +target.closest('button').dataset.ref
    setNotes((notes) => notes.filter((note) => note.id !== currNoteId))
    deleteNoteSupabase(currNoteId)
    toast('Notiz gelöscht')
  }

  const deleteLesson = (e: React.MouseEvent) => {
    const target = e.target as Element
    const lessonId = +target.closest('button').dataset.ref
    const newLessons = lessons.filter((lesson) => lesson.id !== lessonId)
    setLessons(newLessons)
    deleteLessonSupabase(lessonId)
    toast('Lektion gelöscht')
  }

  // [ ] add edit funcitonallity
  const toggleModalEdit = () => {
    setModalEditOpen(!modalEditOpen)
  }

  // [ ] Focus on Title input field
  const toggleModalNotes = () => {
    setModalNotesOpen(!modalNotesOpen)
    setNewNoteInput(noteData)
  }

  return (
    <div className="lessons">
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
            {/* // [ ] search field for student */}
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

      <div className="container--content">
        {previousLesson ? (
          <div className="container container--lessons container--previous-lesson">
            <div className="container--edit-buttons">
              <Button
                type="button"
                btnStyle="icon-only"
                icon={<HiPencilSquare />}
                className="button--edit"
                handler={toggleModalEdit}
              />
              <Button
                type="button"
                btnStyle="icon-only"
                icon={<IoTrashOutline />}
                className="warning"
                handler={deleteLesson}
                dataref={previousLesson.id}
              />
            </div>
            <div className="container--tabs">
              <button
                className={`tab ${tabIndex === 0 && 'tab--active'}`}
                onClick={() => setTabIndex(0)}
              >
                Letzte Lektion: {formatDateToDisplay(previousLesson.date)}
              </button>

              {prePreviousLesson && (
                <button
                  className={`tab ${tabIndex === 1 && 'tab--active'}`}
                  onClick={() => setTabIndex(1)}
                >
                  {formatDateToDisplay(prePreviousLesson.date)}
                </button>
              )}

              {lastBut2Lesson && (
                <button
                  className={`tab ${tabIndex === 2 && 'tab--active'}`}
                  onClick={() => setTabIndex(2)}
                >
                  {formatDateToDisplay(lastBut2Lesson.date)}
                </button>
              )}
            </div>
            <div className="container--two-rows">
              <div className="row-left">
                <h4 className="heading-4">Lektion</h4>
                <div className="content--previous-lesson">
                  {tabIndex === 0 ? previousLesson.lessonContent : null}
                  {tabIndex === 1 ? prePreviousLesson.lessonContent : null}
                  {tabIndex === 2 ? lastBut2Lesson.lessonContent : null}
                </div>
              </div>
              <div className="row-right">
                <h4 className="heading-4">Hausaufgaben</h4>
                <div className="content--previous-lesson">
                  {tabIndex === 0 ? previousLesson.homework : null}
                  {tabIndex === 1 ? prePreviousLesson.homework : null}
                  {tabIndex === 2 ? lastBut2Lesson.homework : null}
                </div>
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
              {/* // [ ] focus on textarea when student changes */}
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
        {modalEditOpen && (
          <Modal
            heading="Lektion bearbeiten"
            handlerOverlay={toggleModalEdit}
            handlerClose={toggleModalEdit}
            buttons={[
              { label: 'Speichern', btnStyle: 'primary', handler: () => {} },
            ]}
          >
            <div className="container--new-lesson">
              <textarea
                className="input"
                value={previousLesson.lessonContent}
              />
            </div>
          </Modal>
        )}
      </div>

      <div className="container--aside">
        <Button
          type="button"
          btnStyle="icon-only"
          className="button--add-note"
          icon={<IoAddOutline />}
          handler={toggleModalNotes}
        />
        <h4 className="heading-4">Notizen</h4>
        {currentNotes &&
          currentNotes.map((note) => (
            <div className="note" key={note.id}>
              <Button
                type="button"
                btnStyle="icon-only"
                handler={deleteNote}
                icon={<IoClose />}
                className="button--delete-note"
                dataref={note.id}
              />
              <h5 className="heading-5">{note.title}</h5>
              <p>{note.text}</p>
            </div>
          ))}
      </div>

      {modalNotesOpen && (
        <Modal
          className="modal--notes"
          heading="Neue Notiz erstellen"
          handlerClose={toggleModalNotes}
          handlerOverlay={toggleModalNotes}
          buttons={[
            { label: 'Speichern', btnStyle: 'primary', handler: saveNote },
          ]}
        >
          <input
            type="text"
            name="title"
            placeholder="Titel"
            className="note-title"
            value={newNoteInput.title}
            onChange={handlerInputNote}
          />
          <textarea
            name="text"
            placeholder="Inhalt"
            className="note-content"
            value={newNoteInput.text}
            onChange={handlerInputNote}
          />
        </Modal>
      )}
    </div>
  )
}

export default Lesson
