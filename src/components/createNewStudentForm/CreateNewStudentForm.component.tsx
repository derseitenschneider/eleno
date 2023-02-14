import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from 'react';
import { useStudents } from '../../Application';
import './CreateNewStudentForm.styles.css'

function CreateNewStudentForm({showForm}) {
    console.log(showForm)

    const {students, setStudents}  = useStudents();
    const [input, setInput] = useState({
    firstName: '',
    lastName: ''
  });

  const createNewStudent = (e:FormEvent) => {
    e.preventDefault();
    setStudents([...students, {firstName: 'Brian', lastName: 'Boy', instrument:'Gitarre', durationMinutes: 40  }])
    setInput(null);
  }

  function setFieldToInput<ChangeEventHandler>(e:ChangeEvent<HTMLInputElement>):void {
    const {name, value} = e.target;
    setInput((prev) => {
      return {...prev, [name]: value}
    })
    console.log(input)
  }
  return (
    <div>
        <form 
          onSubmit={createNewStudent}
          className= {`form-newStudent ${showForm ? 'open': ''}`}>
      <h3 >Vorname</h3>
      <input 
        id='firstName' 
        name='firstName'
        value={input.firstName} 
        type="text" 
        onChange={setFieldToInput}/>

      <h3>Nachname</h3>
      <input 
        id='lastName' 
        name='lastName'
        value={input.lastName} 
        type="text" 
        onChange={setFieldToInput}/>

      <button type='submit'>Speichern</button>
      </form>
    </div>
  );
}

export default CreateNewStudentForm;