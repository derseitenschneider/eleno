import { useEffect, useState } from 'react'

import Sidebar from './layouts/sidebar/Sidebar.component'
import { Outlet, useOutletContext } from "react-router-dom";
import { fetchStudents } from './supabase/supabase';

import { TStudent } from './types/Students.type';





export default function Application() {
  const [students, setStudents] = useState<TStudent[] | null>([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchStudents();
      setStudents([...data])
    }
     fetchData();
  }, [])




  return (
    <div className="App">
      <Sidebar/>
       <div id="main">
        <Outlet context={{students, setStudents}}/>
      </div>
    </div>
  )
}

// export function useStudents() {
//   return useOutletContext<ContextType>();
// }



