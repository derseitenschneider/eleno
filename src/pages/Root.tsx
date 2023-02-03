import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

function Root() {
  return (
    <div>
       <div className="App">
      <Sidebar/>
       <div id="detail">
        <Outlet/>
      </div>
    </div>
    </div>
  );
}

export default Root;