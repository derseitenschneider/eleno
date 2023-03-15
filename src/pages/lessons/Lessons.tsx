import './lessons.style.scss'

// [ ] check loading state with 'loading' top left

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
  // const [activeStudents, setActiveStudents] = useState<TStudent[]>(students)

  const [currentStudent, setCurrentStudent] = useState<TStudent>(null)
  const [currentLessons, setCurrentLessons] = useState<TLesson[]>([])
  const [currentNotes, setCurrentNotes] = useState<TNotes[]>([])

  const [previousLesson, setPreviousLesson] = useState<TLesson>()
  const [prePreviousLesson, setPrePreviousLesson] = useState<TLesson>()
  const [lastBut2Lesson, setLastBut2Lesson] = useState<TLesson>()
  const [tabIndex, setTabIndex] = useState(0)

  const [inputNewLesson, setInputNewLesson] = useState<TLesson>(lessonData)
  const [inputEditLesson, setInputEditLesson] = useState<TLesson>(lessonData)

  const [modalEditOpen, setModalEditOpen] = useState(false)
  const [modalNotesOpen, setModalNotesOpen] = useState(false)

  const [newNoteInput, setNewNoteInput] = useState(noteData)

  const { closestStudentIndex } = useClosestStudent()
  const [studentIndex, setStudentIndex] = useState(0)

  //EFFECTS
  // [ ] get rid of effects -> change them to memo or none

  // [ ] Bring back today state for date

  // [ ] No Closest Studet update when teaching

  console.log('render')

  useEffect(() => {
    const today = new Date()
      .toLocaleDateString('de-CH')
      .split('.')
      .map((e) => e.padStart(2, '0'))
      .join('.')
    setDate(today)
  }, [])

  useEffect(() => {
    setStudentIndex(closestStudentIndex)
  }, [closestStudentIndex])

  const activeStudents: TStudent[] = sortStudentsDateTime(
    students?.filter((student) => !student.archive)
  )

  useEffect(() => {
    activeStudents && setCurrentStudent(activeStudents[studentIndex])
  }, [studentIndex])

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

  const handlerInputEditLesson = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const name = e.target.name
    const value = e.target.value
    const newInput = { ...inputEditLesson, [name]: value }
    setInputEditLesson(newInput)
  }

  // [ ] no save when fields are empty
  const handlerSaveLesson = () => {
    if (!inputNewLesson.date) {
      toast('Die Lektion hat kein Datum', { type: 'error' })
      return
    }
    if (!inputNewLesson.lessonContent) {
      toast('Die Lektion hat keinen Lektionsinhalt', { type: 'error' })
      return
    }

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

  const prevLessonsArr = [previousLesson, prePreviousLesson, lastBut2Lesson]

  return (
    <div className="lessons">
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
                {formatDateToDisplay(previousLesson.date)}
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
                  {prevLessonsArr[tabIndex].lessonContent}
                </div>
              </div>
              <div className="row-right">
                <h4 className="heading-4">Hausaufgaben</h4>
                <div className="content--previous-lesson">
                  {prevLessonsArr[tabIndex].homework}
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
            className="modal--edit-lesson"
            buttons={[
              { label: 'Speichern', btnStyle: 'primary', handler: () => {} },
            ]}
          >
            <div className="container-date">
              <label htmlFor="date">Datum</label>
              <input
                type="text"
                id="date"
                name="date"
                value={formatDateToDisplay(prevLessonsArr[tabIndex].date)}
              />
            </div>
            <div className="container--edit-lesson">
              <textarea
                className="input"
                name="lessonContent"
                value={inputEditLesson.lessonContent}
                onChange={handlerInputEditLesson}
              />
              <textarea
                className="input"
                name="homework"
                value={prevLessonsArr[tabIndex].homework}
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
