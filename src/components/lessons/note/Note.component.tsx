import './note.style.scss'
import { FunctionComponent, useState, useEffect } from 'react'
import Button from '../../button/Button.component'
import { IoEllipsisVertical } from 'react-icons/io5'
import DropDown from '../../dropdown/Dropdown.component'
import { deleteNoteSupabase } from '../../../supabase/notes/notes.supabase'
import { toast } from 'react-toastify'
import { useNotes } from '../../../contexts/NotesContext'
import ModalEditNote from '../../modals/modalEditNote/ModalEditNote.component'
import Modal from '../../modals/Modal.component'

interface NoteProps {
  id: number
  title: string
  text: string
}

const Note: FunctionComponent<NoteProps> = ({ id, title, text }) => {
  const { deleteNote } = useNotes()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [modalEditOpen, setModalEditOpen] = useState(false)
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('.button--edit-note')) setDropdownOpen(false)
    }
    if (dropdownOpen) {
      window.addEventListener('click', closeDropdown)
    }
    return () => {
      window.removeEventListener('click', closeDropdown)
    }
  }, [dropdownOpen])

  return (
    <div className="note">
      <div className="container--edit-button">
        {dropdownOpen ? (
          <DropDown
            positionX="right"
            positionY="top"
            buttons={[
              {
                label: 'Notiz bearbeiten',
                handler: () => {
                  setModalEditOpen(true)
                },
                type: 'normal',
              },
              {
                label: 'Notiz löschen',
                handler: () => setModalDeleteOpen(true),
                type: 'warning',
              },
            ]}
          />
        ) : null}
        <Button
          type="button"
          btnStyle="icon-only"
          icon={<IoEllipsisVertical />}
          className="button--edit-note"
          handler={() => setDropdownOpen((prev) => !prev)}
        />
      </div>
      <h5 className="heading-5">{title}</h5>
      <p>{text}</p>

      {modalEditOpen && (
        <ModalEditNote setModalOpen={setModalEditOpen} currentNote={id} />
      )}

      {modalDeleteOpen && (
        <Modal
          heading="Notiz löschen"
          handlerClose={() => setModalDeleteOpen(false)}
          handlerOverlay={() => setModalDeleteOpen(false)}
          buttons={[
            {
              label: 'Abbrechen',
              btnStyle: 'primary',
              handler: () => setModalDeleteOpen(false),
            },
            {
              label: 'Löschen',
              btnStyle: 'danger',
              handler: () => deleteNote(id),
            },
          ]}
        >
          <p>Möchtest du diese Notiz unwiederruflich löschen?</p>
        </Modal>
      )}
    </div>
  )
}

export default Note
