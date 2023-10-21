import { FC, useEffect, useState } from 'react'
import Table from '../../../common/table/Table.component'
import { TRepertoireItem } from '../../../../types/types'
import { useSearchParams } from 'react-router-dom'
import DatePicker from '../../../common/datePicker/DatePicker.component'
import { TMode } from '../RepertoireItem.component'
import { formatDateToDatabase } from '../../../../utils/formateDate'
import { IoCloseOutline, IoSave } from 'react-icons/io5'
import Button from '../../../common/button/Button.component'
import { useRepertoire } from '../../../../contexts/RepertoireContext'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import { toast } from 'react-toastify'
import { useOutsideClick } from '../../../../hooks/useOutsideClick'

interface WriteRowProps {
  item: TRepertoireItem
  mode: TMode
  setMode: React.Dispatch<React.SetStateAction<TMode>>
}

const WriteRow: FC<WriteRowProps> = ({ item, mode, setMode }) => {
  const { updateRepertoireItem } = useRepertoire()
  const [searchParams, setSearchParams] = useSearchParams()

  const [input, setInput] = useState(item)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (mode === 'write') {
      searchParams.set('edit', String(item.id))
      setSearchParams(searchParams)
    }
  }, [mode])

  const handleAbort = () => {
    setMode('read')
    searchParams.delete('edit')
    setSearchParams(searchParams)
  }

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, title: e.target.value }))
  }

  const handleChangeStartDate = (startDate: string) => {
    setInput((prev) => ({ ...prev, startDate }))
  }

  const handleChangeEndDate = (endDate: string) => {
    setInput((prev) => ({ ...prev, endDate }))
  }

  const handleSaveChanges = async () => {
    setIsPending(true)
    try {
      await updateRepertoireItem(input)
      toast('Änderungen gespeichert')
      setMode('read')
      searchParams.delete('edit')
      setSearchParams(searchParams)
    } catch (error) {
      console.log(error)
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Table.Row className={`write ${isPending ? 'loading' : ''}`}>
      <input
        type="text"
        value={input.title}
        autoFocus
        onChange={handleChangeTitle}
      />
      <DatePicker
        id="end-date"
        setDate={handleChangeStartDate}
        selectedDate={
          input.startDate
            ? new Date(formatDateToDatabase(input.startDate))
            : null
        }
      />
      <DatePicker
        id="start-date"
        setDate={handleChangeEndDate}
        selectedDate={
          input.endDate ? new Date(formatDateToDatabase(input.endDate)) : null
        }
      />
      <div className="buttons">
        <Button
          btnStyle="primary"
          icon={<IoSave />}
          handler={handleSaveChanges}
          disabled={!input.title}
        />
        <Button btnStyle="secondary" handler={handleAbort}>
          <IoCloseOutline />
        </Button>
      </div>
    </Table.Row>
  )
}

export default WriteRow
