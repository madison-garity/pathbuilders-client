import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App'; // Import the router you created

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <App /> {/* Use MainRouter to handle routes */}
    </Router>
  </React.StrictMode>
);

reportWebVitals();
