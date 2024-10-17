import React, { useState } from 'react';
import './Login.css'; // Reuse the same CSS for consistent styling

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Password reset email sent. Check your inbox.');
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Something went wrong.');
    }
  };

  return (
    <div className="login-container"> {/* Reuse the container class */}
      <div className="login-card"> {/* Reuse the card styling */}
        <h2>Forgot Password?</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <button type="submit" className="login-button">Send Reset Link</button>
          {message && <p className="error-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
