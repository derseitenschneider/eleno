import { RepertoireProvider } from '../../../contexts/RepertoireContext'
import RepertoireList from './repertoireList/RepertoireList.component'

interface RepertoireProps {
  studentId: number
}

function Repertoire({ studentId }: RepertoireProps) {
  return (
    <RepertoireProvider>
      <RepertoireList studentId={studentId} />
    </RepertoireProvider>
  )
}

export default Repertoire
