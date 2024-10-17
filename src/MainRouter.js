import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login'; // Login page
import App from './App'; // Main app component
import ForgotPassword from './components/ForgotPassword'; // Forgot password component
import ResetPassword from './components/ResetPassword'; // Reset password component

const MainRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} /> {/* Default route for login page */}
      <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Forgot password route */}
      <Route path="/app" element={<App />} /> {/* Main app after login */}
      
      {/* Reset password route with dynamic token */}
      <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* Reset password route */}
    </Routes>
  );
};

export default MainRouter;
