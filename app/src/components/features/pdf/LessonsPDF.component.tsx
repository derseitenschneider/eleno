import { StyleSheet, Text, View } from '@react-pdf/renderer'
import Html from 'react-pdf-html'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import BaseLayoutPDF from './BaseLayoutPDF.component'
import TablePDF from './TablePDF.component'
import type { PDFProps } from './types'
const styles = StyleSheet.create({
  col1: {
    width: '12%',
    padding: '8px 5px',
  },
  col2: { width: '47%', borderLeft: '1px solid #e2e8f0', padding: '8px 5px' },
  col3: { width: '47%', borderLeft: '1px solid #e2e8f0', padding: '8px 5px' },
  warningBorder: {
    borderLeft: '4px solid #F59E0B', // A solid orange border
  },
  warningBackground: { // New style for background
    backgroundColor: 'rgba(245, 158, 11, 0.5)', // warning/50
  },
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
            {lesson.attendance_status && lesson.attendance_status !== 'held' ? (
              <View
                style={[
                  styles.col2,
                  styles.col3,
                  styles.warningBorder,
                  { flexGrow: 1, borderLeftWidth: 0 }, // Span two columns, remove internal border
                ]}
              >
                <Text style={{ fontWeight: 'bold' }}>
                  {lesson.attendance_status === 'student_absent_excused'
                    ? 'Schülerabsenz (entschuldigt)'
                    : lesson.attendance_status === 'student_absent_not_excused'
                    ? 'Schülerabsenz (unentschuldigt)'
                    : 'Lehrerabsenz'}
                </Text>
                <Text>{lesson.absence_reason || '—'}</Text>
              </View>
            ) : (
              <>
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
              </>
            )}
          </TablePDF>
        </View>
      ))}
    </BaseLayoutPDF>
  )
}