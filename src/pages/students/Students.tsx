import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useStudents } from '../../Application';
import Navbar from '../../components/navbar/Navbar.component';

const navLinks = [
  {path: '/students/', label: 'Schülerliste', key: 1},
  {path: '/students/newstudent', label: 'Schüler:inn erfassen', key:2},
  {path: '/students/archive', label: 'Papierkorb', key: 3},
]

export default function Students(props) {
 const {students, setStudents}  = useStudents()
  return (
    <div>
       <Navbar navLinks={navLinks}/>
        <Outlet context={{students, setStudents}}/>
    </div>
  );
}

