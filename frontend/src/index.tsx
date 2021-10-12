import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Navbar from './Components/Navbar';
import GlobalsStyles from './globalStyles'

ReactDOM.render(
    <React.StrictMode>
    <GlobalsStyles />
    <Navbar />
  </React.StrictMode>
, document.getElementById('root'));