import { useEffect, useState } from 'react'

import Sidebar from './components/sidebar/Sidebar.component'
import { Outlet, useOutletContext } from "react-router-dom";
import { fetchStudents } from './supabase/supabase';

import { TStudent } from './types/Students.type';



type ContextType = {students: TStudent[] | null, setStudents: React.Dispatch<React.SetStateAction<TStudent[]>>
}

export default function Application() {
  const [students, setStudents] = useState<TStudent[] | null>([])

  useEffect(() => {
    const fetchData = async () => {
      const students = await fetchStudents();
      setStudents([...students])
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

export function useStudents() {
  return useOutletContext<ContextType>();
}



