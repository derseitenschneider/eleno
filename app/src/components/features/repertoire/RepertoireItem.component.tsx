import { FC, useState } from 'react'

import { TRepertoireItem } from '../../../../types/types'

import ReadRow from './readRow/ReadRow.component'
import WriteRow from './writeRow/WriteRow.component'

interface RepertoireItemProps {
  item: TRepertoireItem
}

export type TMode = 'read' | 'write'

const RepertoireItem: FC<RepertoireItemProps> = ({ item }) => {
  const [mode, setMode] = useState('read')

  if (mode === 'read')
    return <ReadRow item={item} mode={mode} setMode={setMode} />

  if (mode === 'write')
    return <WriteRow item={item} mode={mode} setMode={setMode} />
}

export default RepertoireItem
