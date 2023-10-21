import { FC, useEffect } from 'react'
import { RepertoireProvider } from '../../../contexts/RepertoireContext'
import RepertoireList from './repertoireList/RepertoireList.component'

interface RepertoireProps {
  studentId: number
}

const Repertoire: FC<RepertoireProps> = ({ studentId }) => {
  return (
    <RepertoireProvider>
      <RepertoireList studentId={studentId} />
    </RepertoireProvider>
  )
}

export default Repertoire
