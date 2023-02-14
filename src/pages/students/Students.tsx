import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from 'react';
import { useStudents } from '../../Application';
import CreateNewStudentForm from '../../components/createNewStudentForm/CreateNewStudentForm.component';


export default function Students() {
  const {students, setStudents}  = useStudents()
  const [formOpen, setFormOpen] = useState(false)

  function toggleStudentFormOpen() {
    setFormOpen(!formOpen);
  }



  return (
    <div>
      <h1>Schüler:innen</h1>
      <ul>
        {students.map(student => <li>{student.firstName}</li>)}
      </ul>
      <button onClick={toggleStudentFormOpen}>Schüler:in hinzufügen</button>
      <CreateNewStudentForm showForm={formOpen}/>
    </div>
  );
}