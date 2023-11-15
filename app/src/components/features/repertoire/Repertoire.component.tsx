import { RepertoireProvider } from '../../../services/context/RepertoireContext'
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
