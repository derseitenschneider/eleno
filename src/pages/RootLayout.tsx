import { useState } from 'react'

import Sidebar from '../components/Sidebar'
import { Outlet } from "react-router-dom";



function RootLayout() {

  return (
    <div className="App">
      <Sidebar/>
       <div id="detail">
        <Outlet/>
      </div>
    </div>
  )
}

export default RootLayout


