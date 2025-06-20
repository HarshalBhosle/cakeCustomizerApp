import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';  // Only import App once
import reportWebVitals from './reportWebVitals';
import './styles/main.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();