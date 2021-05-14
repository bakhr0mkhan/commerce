import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import {Context, FirebaseContextFunc} from './context/index.tsx'


ReactDOM.render(
  <React.StrictMode>
    <FirebaseContextFunc>
      <Context>
       <App />
      </Context>
    </FirebaseContextFunc>
  </React.StrictMode>,
  document.getElementById('root')
);