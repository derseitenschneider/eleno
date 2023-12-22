import { useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { CSVLink } from 'react-csv'

import { useStudents } from '../../../../services/context/StudentContext'
import { TRepertoireItem } from '../../../../types/types'
import Button from '../../../ui/button/Button.component'
import './exportRepertoire.style.scss'

import { formatDateToDisplay } from '../../../../utils/formateDate'
import RepertoirePDF from '../../pdf/RepertoirePDF.component'

interface ExportRepertoireProps {
  repertoire: TRepertoireItem[]
}

function ExportRepertoire({ repertoire }: ExportRepertoireProps) {
  const [title, setTitle] = useState('')
  const { students } = useStudents()
  const { studentId } = repertoire.at(0)
  const { firstName, lastName } = students.find(
    (student) => student.id === studentId,
  )
  const studentFullName = `${firstName} ${lastName}`
  const studentFullNameDashes = `${firstName.split(' ').join('-')}-${lastName}`

  const repertoireCSV = repertoire.map((item, index) => ({
    index: index + 1,
    title: item.title,
    startDate: item.startDate ? formatDateToDisplay(item.startDate) : '',
    endDate: item.endDate ? formatDateToDisplay(item.endDate) : '',
  }))

  return (
    <div className="export-repertoire">
      <h2 className="heading-2">Repertoire exportieren</h2>
      <p>
        Exportiere die Repertoireliste von <b>{studentFullName}</b>.
      </p>

      <div className="export-repertoire__title-input">
        <label htmlFor="title">
          Titel (optional)
          <input
            type="text"
            name="titel"
            id="titel"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const { value } = e.target
              setTitle(value)
            }}
          />
        </label>
      </div>
      <div className="export-repertoire__buttons">
        <PDFDownloadLink
          document={
            <RepertoirePDF
              studentFullName={studentFullName}
              repertoire={repertoire}
              title={title}
            />
          }
          fileName={
            title
              ? title.split(' ').join('-').toLowerCase()
              : `repertoire-${studentFullNameDashes.toLocaleLowerCase()}`
          }
        >
          <Button type="button" btnStyle="primary">
            PDF herunterladen
          </Button>
        </PDFDownloadLink>

        <CSVLink
          data={repertoireCSV}
          headers={[
            { label: '', key: 'index' },
            {
              label: 'Song',
              key: 'title',
            },
            {
              label: 'Start',
              key: 'startDate',
            },
            {
              label: 'Ende',
              key: 'endDate',
            },
          ]}
          filename={
            title
              ? title.split(' ').join('-').toLowerCase()
              : `repertoire-${studentFullNameDashes.toLowerCase()}.csv`
          }
        >
          <Button type="button" btnStyle="primary">
            CSV herunterladen
          </Button>
        </CSVLink>
      </div>
    </div>
  )
}

export default ExportRepertoire
