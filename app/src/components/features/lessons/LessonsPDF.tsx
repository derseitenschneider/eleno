import { StyleSheet, Text, View } from '@react-pdf/renderer'
import Html from 'react-pdf-html'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import BaseLayoutPDF from '../pdf/BaseLayoutPDF.component'
import TablePDF from '../pdf/TablePDF.component'

export type PDFProps = {
  title?: string
  studentFullName: string
  lessons:
    | Array<{
        lessonContent: string | null
        homework: string | null
        date: string
        id: number
      }>
    | undefined
}
const styles = StyleSheet.create({
  col1: {
    width: '12%',
    padding: '8px 5px',
  },
  col2: { width: '47%', borderLeft: '1px solid #e2e8f0', padding: '8px 5px' },
  col3: { width: '47%', borderLeft: '1px solid #e2e8f0', padding: '8px 5px' },
})
const contentStyles = {
  li: {
    paddingLeft: '2mm',
    lineHeight: '1.5',
    paddingBottom: '3px',
  },
}

export function LessonsPDF({ title, lessons, studentFullName }: PDFProps) {
  return (
    <BaseLayoutPDF
      title={title || `Lektionsliste ${studentFullName}`}
      orientation={'portrait'}
    >
      <TablePDF.Head>
        <Text style={styles.col1}>Datum</Text>
        <Text style={styles.col2}>Lektionsinhalt</Text>
        <Text style={styles.col3}>Hausaufgaben</Text>
      </TablePDF.Head>

      {lessons?.map((lesson, index) => (
        <View key={lesson.id}>
          <TablePDF index={index}>
            <Text style={styles.col1}>{lesson.date}</Text>
            <View style={styles.col2} wrap={false}>
              <Html
                stylesheet={contentStyles}
                resetStyles
                style={{ fontSize: '10px' }}
              >
                {lesson.lessonContent || ''}
              </Html>
            </View>
            <View style={styles.col3}>
              <Html
                resetStyles
                stylesheet={contentStyles}
                style={{ fontSize: '10px' }}
              >
                {lesson.homework || ''}
              </Html>
            </View>
          </TablePDF>
        </View>
      ))}
    </BaseLayoutPDF>
  )
}
