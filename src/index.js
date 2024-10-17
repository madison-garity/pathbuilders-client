import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import './index.css';
import reportWebVitals from './reportWebVitals';
import MainRouter from './MainRouter'; // Import the router you created

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <MainRouter /> {/* Use MainRouter to handle routes */}
    </Router>
  </React.StrictMode>
);

reportWebVitals();
