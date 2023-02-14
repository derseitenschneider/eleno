import { useEffect, useState } from 'react'

import Sidebar from './components/sidebar/Sidebar.component'
import { Outlet, useOutletContext } from "react-router-dom";


import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://brhpqxeowknyhrimssxw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyaHBxeGVvd2tueWhyaW1zc3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzY0MDgwMzUsImV4cCI6MTk5MTk4NDAzNX0.hIvCoJwGTLAZTXVhvYi8OCbbXT_EoUKFMF-j_ik-5Vk'
const supabase = createClient(supabaseUrl, supabaseKey)

type TStudent = {
  id?: number,
  firstName: string,
  lastName: string,
  instrument: string,
  durationMinutes: number,
  dayOfLesson?: string,
  startOfLesson?: string,
  endOfLesson?: string
  archive: boolean;
  location: string;
}

type ContextType = {students: TStudent[] | null, setStudents: React.Dispatch<React.SetStateAction<TStudent[]>>
}

export default function Application() {
  const [students, setStudents] = useState<TStudent[] | null>([])

  useEffect(()  => {
    const fetchStudents = async function() {
     
  let { data: students, error } = await supabase
  .from('students')
  .select('*')
      setStudents([...students])
    }
    fetchStudents();
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



