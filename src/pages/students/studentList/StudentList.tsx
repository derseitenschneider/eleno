import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useStudents } from '../../../Application';
import CreateNewStudentForm from '../../../components/createNewStudentForm/CreateNewStudentForm.component';
import Sidebar from '../../../components/sidebar/Sidebar.component';


export default function StudentList() {
  // const {students, setStudents}  = useStudents()
  const [formOpen, setFormOpen] = useState(false)

  function toggleStudentFormOpen() {
    setFormOpen(!formOpen);
  }



  return (
    <div>
      <h1>Schülerliste</h1>
        
    </div>
  );
}