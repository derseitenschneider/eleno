import './manual.style.scss'

import { FunctionComponent } from 'react'
import SidenavManual from '../../components/manual/sidenav-manual/SidenavManual.component'
import ContentManual from '../../components/manual/content-manual/ContentManual.component'

const Manual: FunctionComponent = () => {
  return (
    <div className="manual">
      <SidenavManual />
      <ContentManual />
    </div>
  )
}

export default Manual
