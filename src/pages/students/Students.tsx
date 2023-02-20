import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useStudents } from '../../Application';
import Navbar from '../../components/navbar/navbar.component';

const navLinks = [
  {path: 'list', label: 'Schülerliste', key: 1},
 
  {path: 'archive', label: 'Archiv', key: 2},
]

export default function Students() {
 const {students, setStudents}  = useStudents()
  return (
    <div>
       <Navbar navLinks={navLinks}/>
        <Outlet context={{students, setStudents}}/>
    </div>
  );
}

