import { StyleSheet, Text, View } from '@react-pdf/renderer'
import type { Group, Student } from '../../../types/types'
import BaseLayoutPDF from './BaseLayoutPDF.component'
import TablePDF from './TablePDF.component'

type GrouplistPDFProps = {
  groups: Array<Group>
  userName: string
  title: string
}

const styles = StyleSheet.create({
  col1: {
    width: '4%',
    padding: '8px 5px ',
  },
  col2: {
    width: '36.75%',
    padding: '8px 5px ',
  },
  col3: {
    width: '10%',
    padding: '8px 5px ',
  },
  col4: {
    width: '5%',
    padding: '8px 5px ',
  },
  col5: {
    width: '5%',
    padding: '8px 5px ',
  },
  col6: {
    width: '8%',
    padding: '8px 5px ',
  },
  col7: { width: '26%', padding: '8px 5px' },
})

export default function GrouplistPDF({
  groups,
  userName,
  title,
}: GrouplistPDFProps) {
  return (
    <BaseLayoutPDF
      title={title || `Gruppen ${userName}`}
      orientation='landscape'
    >
      <TablePDF.Head>
        <Text style={styles.col1} />
        <Text style={styles.col2}>Name</Text>
        <Text style={styles.col3}>Tag</Text>
        <Text style={styles.col4}>Von</Text>
        <Text style={styles.col5}>Bis</Text>
        <Text style={styles.col6}>Dauer</Text>
        <Text style={styles.col7}>Unterrichtsort</Text>
      </TablePDF.Head>

      {groups.map((group, index) => (
        <View key={group.id}>
          <TablePDF index={index}>
            <Text style={styles.col1}>{index + 1}.</Text>
            <Text style={styles.col2}>{group.name}</Text>
            <Text style={styles.col3}>{group.dayOfLesson ?? '–'}</Text>
            <Text style={styles.col4}>
              {group.startOfLesson?.substring(0, 5) ?? '–'}
            </Text>
            <Text style={styles.col5}>
              {group.endOfLesson?.substring(0, 5) ?? '–'}
            </Text>
            <Text style={styles.col6}>
              {group.durationMinutes ? `${group.durationMinutes} Min.` : '–'}
            </Text>
            <Text style={styles.col7}>{group.location ?? '–'}</Text>
          </TablePDF>
        </View>
      ))}
    </BaseLayoutPDF>
  )
}
