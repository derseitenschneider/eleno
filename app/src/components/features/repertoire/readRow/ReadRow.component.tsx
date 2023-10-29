import { useState } from 'react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useRepertoire } from '../../../../contexts/RepertoireContext'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import { TRepertoireItem } from '../../../../types/types'
import { formatDateToDisplay } from '../../../../utils/formateDate'
import Menus from '../../../common/menu/Menus.component'
import Table from '../../../common/table/Table.component'
import { TMode } from '../RepertoireItem.component'

interface ReadRowProps {
  item: TRepertoireItem
  setMode: React.Dispatch<React.SetStateAction<TMode>>
}

function ReadRow({ item, setMode }: ReadRowProps) {
  const { title, startDate, endDate } = item
  const [isPending, setIsPending] = useState(false)
  const { deleteRepertoireItem } = useRepertoire()

  const [searchParams, setSearchParams] = useSearchParams()
  const editing = searchParams.get('edit')

  const handleDelete = async () => {
    setIsPending(true)
    try {
      await deleteRepertoireItem(item.id)
      toast('Song gelöscht')
      setMode('read')
      searchParams.delete('edit')
      setSearchParams(searchParams)
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  const handleEditClick = () => {
    searchParams.set('edit', String(item.id))
    setSearchParams(searchParams)
    setMode('write')
  }

  return (
    <Table.Row
      className={`${editing ? 'inactive' : ''} ${isPending ? 'loading' : ''}`}
    >
      <span>{title}</span>
      <span className="date">
        {startDate ? formatDateToDisplay(startDate) : ''}
      </span>
      <span className="date">
        {endDate ? formatDateToDisplay(endDate) : ''}
      </span>

      <Menus.Toggle id={item.id} />
      <Menus.Menu>
        <Menus.List id={item.id}>
          <Menus.Button onClick={handleEditClick} icon={<HiPencil />}>
            Bearbeiten
          </Menus.Button>

          <Menus.Button
            onClick={handleDelete}
            icon={<HiTrash />}
            iconColor="var(--clr-warning)"
          >
            Löschen
          </Menus.Button>
        </Menus.List>
      </Menus.Menu>
    </Table.Row>
  )
}

export default ReadRow
