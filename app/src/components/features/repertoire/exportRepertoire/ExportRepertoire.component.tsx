import { PDFDownloadLink } from '@react-pdf/renderer'
import { CSVLink } from 'react-csv'

import './exportRepertoire.style.scss'
import { TRepertoireItem } from '../../../../types/types'
import { useStudents } from '../../../../services/context/StudentContext'
import Button from '../../../ui/button/Button.component'

import RepertoirePDF from '../../pdf/RepertoirePDF.component'
import { formatDateToDisplay } from '../../../../utils/formateDate'

interface ExportRepertoireProps {
  repertoire: TRepertoireItem[]
}

function ExportRepertoire({ repertoire }: ExportRepertoireProps) {
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
      <div className="export-repertoire__buttons">
        <PDFDownloadLink
          document={
            <RepertoirePDF
              studentFullName={studentFullName}
              repertoire={repertoire}
            />
          }
          fileName={`repertoire-${studentFullNameDashes.toLocaleLowerCase()}`}
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
          filename={`repertoire-${studentFullNameDashes.toLowerCase()}.csv`}
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
