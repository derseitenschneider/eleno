import { StyleSheet, Text, View } from '@react-pdf/renderer'
import Html from 'react-pdf-html'

import { TLesson } from '../../../types/types'
import { formatDateToDisplay } from '../../../utils/formateDate'
import BaseLayoutPDF from './BaseLayoutPDF.component'
import TablePDF from './TablePDF.component'

interface LessonsPDFProps {
  lessons: TLesson[]
  studentFullName: string
}

const contentStyles = {
  li: {
    paddingLeft: '2mm',
    lineHeight: '1.5',
    paddingBottom: '3px',
  },
}

const styles = StyleSheet.create({
  col1: {
    width: '12%',
    padding: '8px 5px',
  },
  col2: { width: '47%', borderLeft: '1px solid #e2e8f0', padding: '8px 5px' },
  col3: { width: '47%', borderLeft: '1px solid #e2e8f0', padding: '8px 5px' },
})

export default function LessonPDF({
  lessons,
  studentFullName,
}: LessonsPDFProps) {
  const sanitizedLessons = lessons.map((lesson) => {
    const sanitizedContent = lesson.lessonContent
      .replaceAll('\n', '<br></br>')
      .replaceAll('style', '')

    const sanitizedHomework = lesson.homework.replaceAll('\n', '<br></br>')

    const newLesson = { ...lesson, sanitizedContent, sanitizedHomework }
    return newLesson
  })

  return (
    <BaseLayoutPDF
      studentFullName={studentFullName}
      orientation="portrait"
      title="Lektionsliste"
    >
      <TablePDF.Head>
        <Text style={styles.col1}>Datum</Text>
        <Text style={styles.col2}>Lektionsinhalt</Text>
        <Text style={styles.col3}>Hausaufgaben</Text>
      </TablePDF.Head>

      {sanitizedLessons?.map((lesson, index) => (
        <TablePDF key={lesson.id} index={index}>
          <Text style={styles.col1}>{formatDateToDisplay(lesson.date)}</Text>
          <View style={styles.col2} wrap={false}>
            <Html
              stylesheet={contentStyles}
              resetStyles
              style={{ fontSize: '10px' }}
            >
              {lesson.sanitizedContent}
            </Html>
          </View>
          <View style={styles.col3}>
            <Html
              resetStyles
              stylesheet={contentStyles}
              style={{ fontSize: '10px' }}
            >
              {lesson.sanitizedHomework}
            </Html>
          </View>
        </TablePDF>
      ))}
    </BaseLayoutPDF>
  )
}
