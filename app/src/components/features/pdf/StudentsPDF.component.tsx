import { Document, Page, StyleSheet, View, Text } from '@react-pdf/renderer'

import { TStudent } from '../../../types/types'

interface StudentListPDFProps {
  students: TStudent[]
}

const styles = StyleSheet.create({
  page: {
    margin: '1cm',
  },
  column: {
    display: 'flex',
    flexDirection: 'row',
    gap: '14px',
    fontSize: '14px',
  },
})

export default function StudentListPDF({ students }: StudentListPDFProps) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.column}>
          <Text>Vorname</Text>
          <Text>Nachname</Text>
          <Text>Instrument</Text>
          <Text>Tag</Text>
          <Text>Von</Text>
          <Text>Bis</Text>
          <Text>Dauer</Text>
          <Text>Unterrichtsort</Text>
        </View>
        {students?.map((student) => (
          <View style={styles.column} key={student.id}>
            <Text>{student.firstName}</Text>
            <Text>{student.lastName}</Text>
            <Text>{student.instrument}</Text>
            <Text>{student.dayOfLesson}</Text>
            <Text>{student.startOfLesson}</Text>
            <Text>{student.endOfLesson}</Text>
            <Text>{student.durationMinutes}</Text>
            <Text>{student.location}</Text>
          </View>
        ))}
      </Page>
    </Document>
  )
}
