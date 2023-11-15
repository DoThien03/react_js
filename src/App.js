import React from 'react';
import './styles/App.scss';
import './styles/commonLayout.scss';
import Routers from './routers';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routers />
    </BrowserRouter>
  );
}

export default App;
