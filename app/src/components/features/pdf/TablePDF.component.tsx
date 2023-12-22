import { StyleSheet, View } from '@react-pdf/renderer'

interface TablePDFProps {
  children: React.ReactNode
  index?: number
  wrap?: boolean
}

const styles = StyleSheet.create({
  table: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    textAlign: 'left',
    gap: '14px',
  },
  tableHead: {
    fontWeight: 'bold',
    borderBottom: '1px solid #e2e8f0',
  },
  rowUneven: {
    backgroundColor: '#f8fafc',
  },
})

function TableHeadPDF({ children }: { children: React.ReactNode }) {
  return <View style={[styles.table, styles.tableHead]}>{children}</View>
}

function TablePDF({ children, index, wrap = false }: TablePDFProps) {
  return (
    <View
      style={
        index % 2 === 1 ? [styles.table] : [styles.table, styles.rowUneven]
      }
      wrap={wrap}
    >
      {children}
    </View>
  )
}

TablePDF.Head = TableHeadPDF

export default TablePDF
