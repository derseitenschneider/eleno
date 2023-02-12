import { useState } from 'react';

interface IStudents {
  name: string
}


function Students() {
  const [students, setStudents] = useState<IStudents[] | []>([{name: 'Brian'}]);
  const [input, setInput] = useState('');

  const createNewStudent = (e) => {
    e.preventDefault();
    setStudents([...students, {name: input}])
  }

  return (
    <div>
      <h1>Students</h1>
      <ul>
        {students.map(student => <li>{student.name}</li>)}
      </ul>
      <form action="" onSubmit={createNewStudent}>
      <input value={input} type="text" onChange={(e) => setInput(e.target.value)}/>
      <button type='submit'>Speichern</button>
      </form>
    </div>
  );
}

export default Students;