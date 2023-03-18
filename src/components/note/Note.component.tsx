import './note.style.scss'
import { FunctionComponent, useState, useEffect } from 'react'
import Button from '../button/Button.component'
import { IoEllipsisVertical } from 'react-icons/io5'
import DropDown from '../dropdown/Dropdown.component'
import { TNotes } from '../../types/types'
import { deleteNoteSupabase } from '../../supabase/notes/notes.supabase'
import { toast } from 'react-toastify'

interface NoteProps {
  id: number
  title: string
  text: string
  setNotes: React.Dispatch<React.SetStateAction<TNotes[]>>
  setModalEditOpen: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentNoteId: React.Dispatch<React.SetStateAction<number | null>>
}

const Note: FunctionComponent<NoteProps> = ({
  id,
  title,
  text,
  setNotes,
  setModalEditOpen,
  setCurrentNoteId,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const deleteNote = (e: React.MouseEvent) => {
    setNotes((notes) => notes.filter((note) => note.id !== id))
    deleteNoteSupabase(id)
    toast('Notiz gelöscht')
  }

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
                  setCurrentNoteId(id)
                },
                type: 'normal',
              },
              { label: 'Notiz löschen', handler: deleteNote, type: 'warning' },
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
    </div>
  )
}

export default Note
