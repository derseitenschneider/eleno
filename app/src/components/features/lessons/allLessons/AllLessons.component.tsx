import { motion } from 'framer-motion'
import parse from 'html-react-parser'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { FiShare } from 'react-icons/fi'

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLessons } from '../../../../services/context/LessonsContext'
import { useStudents } from '../../../../services/context/StudentContext'

import Loader from '../../../ui/loader/Loader'

import './allLessons.style.scss'
import Table from '../../../ui/table/Table.component'
import { formatDateToDisplay } from '../../../../utils/formateDate'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import Menus from '../../../ui/menu/Menus.component'
import Modal from '../../../ui/modal/Modal.component'
import EditLesson from '../editLesson/EditLesson.component'
import ShareHomework from '../shareHomework/ShareHomework.component'
import { TLesson } from '../../../../types/types'
import Button from '../../../ui/button/Button.component'

function AllLessons() {
  const { students } = useStudents()
  const [isPending, setIsPending] = useState(true)
  const { getAllLessons, setLessons } = useLessons()
  const [allLessons, setAllLessons] = useState<TLesson[]>()
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const studentId = Number(searchParams.get('studentId'))
  // const allStudentLessons = lessons.filter(
  //   (lesson) => lesson.studentId === studentId,
  // )

  const { firstName, lastName } = students.find(
    (student) => student.id === studentId,
  )
  const studentName = `${firstName} ${lastName}`

  useEffect(() => {
    const fetchAllLessons = async () => {
      try {
        const lessons = await getAllLessons(studentId)
        // setLessons((prev) => [...prev, ...allLessons])
        setAllLessons(lessons)
      } catch (error) {
        fetchErrorToast()
      } finally {
        setIsPending(false)
      }
    }
    fetchAllLessons()
  }, [getAllLessons, setLessons, studentId])

  return (
    <motion.div
      className="all-lessons"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="all-lessons__buttons">
        <Button
          type="button"
          btnStyle="secondary"
          onClick={() => navigate('/lessons')}
        >
          Zurück zur Lektion
        </Button>
      </div>
      <h1 className="heading-1">Lektionsliste {studentName}</h1>
      {isPending && <Loader loading={isPending} />}
      {!isPending && (
        <Table columns="12rem 1fr 1fr 4rem">
          <Table.Header>
            <div>
              <span>Datum</span>
            </div>
            <div>
              <span>Lektion</span>
            </div>
            <div>
              <span>Hausaufgaben</span>
            </div>
            <div />
          </Table.Header>

          <Menus>
            <Table.Body
              alternateColor
              className="all-lessons__table"
              data={allLessons}
              emptyMessage="Noch keine Lektionen erfasst."
              render={(lesson) => (
                <Menus.Menu key={lesson.id}>
                  <Table.Row key={lesson.id}>
                    <div>{formatDateToDisplay(lesson.date)}</div>
                    <div>{parse(lesson.lessonContent)}</div>
                    <div>{parse(lesson.homework)}</div>
                    <Modal>
                      <Menus.Toggle id={lesson.id} />

                      <Menus.List id={lesson.id}>
                        <Modal.Open opens="edit-lesson">
                          <Menus.Button icon={<HiPencil />}>
                            Lektion bearbeiten
                          </Menus.Button>
                        </Modal.Open>

                        <Modal.Open opens="share-homework">
                          <Menus.Button icon={<FiShare />}>
                            Hausaufgaben teilen
                          </Menus.Button>
                        </Modal.Open>

                        <Modal.Open opens="delete-lesson">
                          <Menus.Button
                            icon={<HiTrash />}
                            iconColor="var(--clr-warning)"
                          >
                            Lektion löschen
                          </Menus.Button>
                        </Modal.Open>

                        <Modal.Window name="edit-lesson">
                          <EditLesson lesson={lesson} />
                        </Modal.Window>
                        <Modal.Window name="share-homework">
                          <ShareHomework lessonId={lesson.id} />
                        </Modal.Window>
                      </Menus.List>
                    </Modal>
                  </Table.Row>
                </Menus.Menu>
              )}
            />
          </Menus>
        </Table>
      )}
    </motion.div>
  )
}

export default AllLessons
