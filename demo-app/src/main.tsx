import React from 'react';
import ReactDOM from 'react-dom/client';
import '../../app/src/scss/global.scss';
import { RouterProvider } from 'react-router-dom';

import { mainRouter } from '../../app/src/router/mainRouter';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={mainRouter} />
  </React.StrictMode>
);
