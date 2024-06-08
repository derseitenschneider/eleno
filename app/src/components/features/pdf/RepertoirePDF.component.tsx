import { StyleSheet, Text, View } from "@react-pdf/renderer"
import type { RepertoireItem } from "../../../types/types"
import BaseLayoutPDF from "./BaseLayoutPDF.component"
import TablePDF from "./TablePDF.component"
import { useUserLocale } from "@/services/context/UserLocaleContext"

interface RepertoirePDFProps {
  repertoire: RepertoireItem[]
  studentFullName: string
  title: string
}

const styles = StyleSheet.create({
  col1: { width: "1%", padding: "8px 5px" },
  col2: { width: "75%", padding: "8px 5px" },
  col3: { width: "12%", padding: "8px 5px" },
  col4: { width: "12%", padding: "8px 5px" },
})

function RepertoirePDF({
  repertoire,
  studentFullName,
  title,
}: RepertoirePDFProps) {
  const { userLocale } = useUserLocale()
  return (
    <BaseLayoutPDF
      title={title || `Repertoire ${studentFullName}`}
      orientation='portrait'
    >
      <TablePDF.Head>
        <View style={styles.col1} />
        <Text style={styles.col2}>Song</Text>
        <Text style={styles.col3}>Start</Text>
        <Text style={styles.col4}>Ende</Text>
      </TablePDF.Head>

      {repertoire.map((item, index) => (
        <TablePDF key={item.id} index={index}>
          <Text style={styles.col1}>{`${index + 1}.`}</Text>
          <Text style={styles.col2}>{item.title}</Text>
          <Text style={styles.col3}>
            {item.startDate
              ? item.startDate.toLocaleDateString(userLocale, {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })
              : ""}
          </Text>
          <Text style={styles.col4}>
            {item.endDate
              ? item.endDate.toLocaleDateString(userLocale, {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })
              : ""}
          </Text>
        </TablePDF>
      ))}
    </BaseLayoutPDF>
  )
}

export default RepertoirePDF
