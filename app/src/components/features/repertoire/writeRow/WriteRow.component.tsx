import { useState } from 'react'
import { IoCloseOutline, IoSave } from 'react-icons/io5'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useRepertoire } from '../../../../services/context/RepertoireContext'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import { TRepertoireItem } from '../../../../types/types'
import { formatDateToDatabase } from '../../../../utils/formateDate'
import Button from '../../../ui/button/Button.component'
import DatePicker from '../../../ui/datePicker/DatePicker.component'
import Table from '../../../ui/table/Table.component'
import { TMode } from '../RepertoireItem.component'

interface WriteRowProps {
  item: TRepertoireItem
  setMode: React.Dispatch<React.SetStateAction<TMode>>
}

function WriteRow({ item, setMode }: WriteRowProps) {
  const { updateRepertoireItem } = useRepertoire()
  const [searchParams, setSearchParams] = useSearchParams()

  const [input, setInput] = useState(item)
  const [isPending, setIsPending] = useState(false)

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
          type="button"
          btnStyle="primary"
          icon={<IoSave />}
          handler={handleSaveChanges}
          disabled={!input.title}
        />
        <Button type="button" btnStyle="secondary" handler={handleAbort}>
          <IoCloseOutline />
        </Button>
      </div>
    </Table.Row>
  )
}

export default WriteRow
