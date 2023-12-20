import { StyleSheet, Text } from '@react-pdf/renderer'
import { TStudent } from '../../../types/types'
import BaseLayoutPDF from './BaseLayoutPDF.component'
import TablePDF from './TablePDF.component'

interface StudentListPDFProps {
  students: TStudent[]
  userName: string
}

const styles = StyleSheet.create({
  col1: {
    width: '4%',
    padding: '8px 5px ',
  },
  col2: {
    width: '12.25%',
    padding: '8px 5px ',
  },
  col3: {
    width: '12.25%',
    padding: '8px 5px ',
  },
  col4: {
    width: '12.25%',
    padding: '8px 5px ',
  },
  col5: {
    width: '10%',
    padding: '8px 5px ',
  },
  col6: {
    width: '5%',
    padding: '8px 5px ',
  },
  col7: {
    width: '5%',
    padding: '8px 5px ',
  },
  col8: {
    width: '5%%',
    padding: '8px 5px ',
  },
  col9: { width: '26%', padding: '8px 5px' },
})

function StudentListPDF({ students, userName }: StudentListPDFProps) {
  return (
    <BaseLayoutPDF
      title={`Schüler:innen-Liste ${userName}`}
      orientation="landscape"
    >
      <TablePDF.Head>
        <Text style={styles.col1} />
        <Text style={styles.col2}>Vorname</Text>
        <Text style={styles.col3}>Nachname</Text>
        <Text style={styles.col4}>Instrument</Text>
        <Text style={styles.col5}>Tag</Text>
        <Text style={styles.col6}>Von</Text>
        <Text style={styles.col7}>Bis</Text>
        <Text style={styles.col8}>Dauer</Text>
        <Text style={styles.col9}>Unterrichtsort</Text>
      </TablePDF.Head>

      {students.map((student, index) => (
        <TablePDF key={student.id} index={index}>
          <Text style={styles.col1}>{index + 1}.</Text>
          <Text style={styles.col2}>{student.firstName}</Text>
          <Text style={styles.col3}>{student.lastName}</Text>
          <Text style={styles.col4}>{student.instrument}</Text>
          <Text style={styles.col5}>{student.dayOfLesson}</Text>
          <Text style={styles.col6}>{student.startOfLesson}</Text>
          <Text style={styles.col7}>{student.endOfLesson}</Text>
          <Text style={styles.col8}>{student.durationMinutes}</Text>
          <Text style={styles.col9}>{student.location}</Text>
        </TablePDF>
      ))}
    </BaseLayoutPDF>
  )
}

export default StudentListPDF
