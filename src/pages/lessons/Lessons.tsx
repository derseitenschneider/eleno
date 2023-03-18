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
import Modal from '../../components/modals/Modal.component'
import {
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoPersonCircleOutline,
  IoTrashOutline,
  IoAddOutline,
  IoClose,
  IoEllipsisHorizontal,
} from 'react-icons/io5'

import { HiPencilSquare } from 'react-icons/hi2'
import Note from '../../components/note/Note.component'

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

import { useClosestStudent } from '../../contexts/ClosestStudentContext'
import Loader from '../../components/loader/Loader'
import { useUser } from '../../contexts/UserContext'
import NoActiveStudent from '../../components/noActiveStudent/NoActiveStudent'
import { Navigate, useNavigate } from 'react-router-dom'
import ModalEditLesson from '../../components/modals/modalEditLesson/ModalEditLesson.component'
import ModalAddNote from '../../components/modals/modalAddNotes/ModalAddNote.component'
import DropDown from '../../components/dropdown/Dropdown.component'
import ModalEditNote from '../../components/modals/modalEditNote/ModalEditNote.component'

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
  const { user } = useUser()
  const [date, setDate] = useState<string>('')
  const { lessons, setLessons } = useLessons()
  const { students } = useStudents()
  const { notes, setNotes } = useNotes()

  const [currentStudent, setCurrentStudent] = useState<TStudent>(null)
  const [currentLessons, setCurrentLessons] = useState<TLesson[]>([])
  const [currentNotes, setCurrentNotes] = useState<TNotes[]>([])
  const [currentNoteId, setCurrentNoteId] = useState<number | null>(null)

  const [previousLesson, setPreviousLesson] = useState<TLesson>()
  const [prePreviousLesson, setPrePreviousLesson] = useState<TLesson>()
  const [lastBut2Lesson, setLastBut2Lesson] = useState<TLesson>()
  const [tabIndex, setTabIndex] = useState(0)

  const [inputNewLesson, setInputNewLesson] = useState<TLesson>(lessonData)
  const [inputEditLesson, setInputEditLesson] = useState<TLesson>(lessonData)

  const [modalEditLessonOpen, setModalEditLessonOpen] = useState(false)
  const [modalAddNoteOpen, setModalAddNoteOpen] = useState(false)
  const [modalEditNoteOpen, setModalEditNoteOpen] = useState(false)

  const [newNoteInput, setNewNoteInput] = useState(noteData)

  const [dropdownEditLessonOpen, setDropdownEditLessonOpen] = useState(false)

  const { closestStudentIndex } = useClosestStudent()
  const [studentIndex, setStudentIndex] = useState(0)

  const navigate = useNavigate()

  //EFFECTS
  // [ ] get rid of effects -> change them to memo or none

  // [ ] No Closest Studet update when teaching

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
    students.filter((student) => !student.archive)
  )

  const prevLessonsArr = [previousLesson, prePreviousLesson, lastBut2Lesson]

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

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('.button--edit')) setDropdownEditLessonOpen(false)
    }
    if (dropdownEditLessonOpen) {
      window.addEventListener('click', closeDropdown)
    }
    return () => {
      window.removeEventListener('click', closeDropdown)
    }
  }, [dropdownEditLessonOpen])

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
    if (!date) {
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
      const [data] = await postLesson(newLesson, user.id)
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

  // Delete Lesson
  const deleteLesson = () => {
    const lessonId = prevLessonsArr[tabIndex].id
    const newLessons = lessons.filter((lesson) => lesson.id !== lessonId)
    setLessons(newLessons)
    deleteLessonSupabase(lessonId)
    toast('Lektion gelöscht')
  }
  // const saveNote = () => {
  //   const tempID = Math.floor(Math.random() * 10000000)
  //   const newNote = { ...newNoteInput, studentId: currentStudent.id }
  //   const tempNotes: TNotes[] = [...notes, { ...newNote, id: tempID }]
  //   setNotes(tempNotes)
  //   setNewNoteInput(noteData)
  //   setModalAddNoteOpen(false)
  //   const postData = async () => {
  //     const [data] = await postNotes(newNote, currentStudent.id, user.id)
  //     setNotes((notes) =>
  //       notes.map((note) =>
  //         note.id === tempID ? { ...note, id: data.id } : note
  //       )
  //     )
  //   }
  //   postData()
  //   toast('Notiz gespeichert')
  // }

  // const deleteNote = (e: React.MouseEvent) => {
  //   const target = e.target as Element
  //   const currNoteId = +target.closest('button').dataset.ref
  //   setNotes((notes) => notes.filter((note) => note.id !== currNoteId))
  //   deleteNoteSupabase(currNoteId)
  //   toast('Notiz gelöscht')
  // }

  // [ ] add edit funcitonallity
  const toggleModalEdit = () => {
    setModalEditLessonOpen(!modalEditLessonOpen)
    setInputEditLesson(prevLessonsArr[tabIndex])
    setDropdownEditLessonOpen(false)
  }

  // [ ] Focus on Title input field
  // const toggleModalNotes = () => {
  //   setModalAddNoteOpen(!modalAddNoteOpen)
  //   setNewNoteInput(noteData)
  // }

  const navigateToStudents = () => {
    navigate('/students')
  }

  return (
    <>
      <Loader loading={loading} />
      {!loading && activeStudents.length ? (
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
                    icon={<IoEllipsisHorizontal />}
                    className="button--edit"
                    handler={() => setDropdownEditLessonOpen((prev) => !prev)}
                  />
                  {dropdownEditLessonOpen ? (
                    <DropDown
                      positionX="right"
                      positionY="bottom"
                      buttons={[
                        {
                          label: 'Lektion bearbeiten',
                          handler: toggleModalEdit,
                          type: 'normal',
                        },
                        {
                          label: 'Lektion löschen',
                          handler: deleteLesson,
                          type: 'warning',
                        },
                      ]}
                    />
                  ) : null}
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
            {modalEditLessonOpen && (
              <ModalEditLesson
                toggleModalEdit={toggleModalEdit}
                input={inputEditLesson}
                setInput={setInputEditLesson}
                setCurrentLessons={setCurrentLessons}
                lessons={lessons}
                setLessons={setLessons}
              />
            )}
          </div>

          <div className="container--aside">
            <Button
              type="button"
              btnStyle="icon-only"
              className="button--add-note"
              icon={<IoAddOutline />}
              handler={() => setModalAddNoteOpen((prev) => !prev)}
            />
            <h4 className="heading-4">Notizen</h4>
            {currentNotes &&
              currentNotes.map((note) => (
                <Note
                  key={note.id}
                  id={note.id}
                  title={note.title}
                  text={note.text}
                  setNotes={setNotes}
                  setModalEditOpen={setModalEditNoteOpen}
                  setCurrentNoteId={setCurrentNoteId}
                />
              ))}
          </div>

          {modalAddNoteOpen ? (
            <ModalAddNote
              modalOpen={modalAddNoteOpen}
              setModalOpen={setModalAddNoteOpen}
              currentStudent={currentStudent}
              notes={notes}
              setNotes={setNotes}
            />
          ) : null}

          {modalEditNoteOpen ? (
            <ModalEditNote
              setModalOpen={setModalEditNoteOpen}
              currentNote={notes.find((note) => note.id === currentNoteId)}
              setNotes={setNotes}
              notes={notes}
            />
          ) : null}
        </div>
      ) : (
        <div className="container">
          <NoActiveStudent handler={navigateToStudents} />
        </div>
      )}
    </>
  )
}

export default Lesson
