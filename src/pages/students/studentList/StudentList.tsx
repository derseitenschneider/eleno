import { useState } from 'react';
import { useStudents } from '../../../Application';
import './studentlist.styles.css'



export default function StudentList() {
  const {students, setStudents}  = useStudents()
  const [formOpen, setFormOpen] = useState(false)

  function toggleStudentFormOpen() {
    setFormOpen(!formOpen);
  }





  return (
    <div>
      <h1>Schülerliste</h1>
      <table>
        <thead>
        <tr>
          <th>Vorname</th>
          <th>Nachname</th>
          <th>Instrument</th>
          <th>Tag</th>
          <th>Zeit</th>
          <th>Dauer</th>
        </tr>
        </thead>
        <tbody>
        {students.map(student =>
          <tr>
            <td>{student.firstName}</td>
            <td>{student.lastName}</td>
            <td>{student.instrument}</td>
            <td>{student.dayOfLesson}</td>
            <td>{student.startOfLesson} - {student.endOfLesson}</td>
            <td>{student.durationMinutes}min</td>
          </tr>
          )}
          </tbody>
      </table>
        
    </div>
  );
}