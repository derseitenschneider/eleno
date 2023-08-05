import './manual.style.scss'

import { FunctionComponent } from 'react'
import SidenavManual from '../../components/manual/sidenav-manual/SidenavManual.component'
import ContentManual from '../../components/manual/content-manual/ContentManual.component'
import { Outlet } from 'react-router-dom'
import ScrollToTop from '../../hooks/ScrollToTop'

interface ManualProps {}

const Manual: FunctionComponent<ManualProps> = () => {
  return (
    <div className="manual">
      <SidenavManual />
      <div className="wrapper-content">
        <Outlet />
      </div>
    </div>
  )
}

export default Manual
