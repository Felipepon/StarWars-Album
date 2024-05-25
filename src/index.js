import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AlbumProvider } from './Context/AlbumContext';
import { TimerProvider } from './Context/TimerContext';

ReactDOM.render(
  <TimerProvider>
    <AlbumProvider>
      <App />
    </AlbumProvider>
  </TimerProvider>,
  document.getElementById('root')
);