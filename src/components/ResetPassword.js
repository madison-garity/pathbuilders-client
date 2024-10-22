import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Login.css'; // Reuse the same CSS as Login for styling consistency

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate(); // Use to navigate to login screen
  const [isSuccess, setIsSuccess] = useState(false); // State to track success

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Password has been updated. You can now log in.');
        setIsSuccess(true); // Set success state
      } else {
        setMessage(data.error);
        setIsSuccess(false); // Ensure success state is false
      }
    } catch (error) {
      setMessage('Something went wrong.');
      setIsSuccess(false); // Ensure success state is false
    }
  };

  const handleGoToLogin = () => {
    navigate('/'); // Redirect to the login screen
  };

  return (
    <div className="login-container"> {/* Reuse the container class for the layout */}
      <div className="login-card"> {/* Reuse the card styling */}
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              required
            />
          </div>
          <button type="submit" className="login-button">Reset Password</button>
          {message && <p className="error-message">{message}</p>}
        </form>
        {isSuccess && ( 
          <button className="login-button" onClick={handleGoToLogin}>
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
