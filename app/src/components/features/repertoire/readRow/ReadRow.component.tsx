import { toast } from 'react-toastify'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { useSearchParams } from 'react-router-dom'
import { FC, useState } from 'react'
import { TRepertoireItem } from '../../../../types/types'
import Table from '../../../common/table/Table.component'
import Menus from '../../../common/menu/Menus.component'
import { formatDateToDisplay } from '../../../../utils/formateDate'
import { TMode } from '../RepertoireItem.component'
import { useRepertoire } from '../../../../contexts/RepertoireContext'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'

interface ReadRowProps {
  item: TRepertoireItem
  mode: TMode
  setMode: React.Dispatch<React.SetStateAction<TMode>>
}

const ReadRow: FC<ReadRowProps> = ({ item, setMode, mode }) => {
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
          <Menus.Button onClick={() => setMode('write')} icon={<HiPencil />}>
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
