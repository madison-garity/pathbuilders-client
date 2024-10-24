import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowDropleft } from "react-icons/io";
import './AddUser.css'; // Create styles for your form here

const AddUserPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    length: false,
  });
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('accounts'); // Active tab management
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    setPasswordStrength({
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      length: password.length >= 8,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
  
    // Password validation
    if (!passwordStrength.lowercase || !passwordStrength.uppercase || !passwordStrength.number || !passwordStrength.length) {
      setError('Password must contain at least one lowercase letter, one uppercase letter, one number, and be at least 8 characters long.');
      setLoading(false);
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });
  
      if (response.ok) {
        navigate('/settings'); // Redirect to users page
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'An error occurred');
      }
    } catch (error) {
      setError('Failed to create user');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="settings-page">
      <div className="settings-content">
        <h1>Settings</h1>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'accounts' ? 'active' : ''}`}
            onClick={() => navigate('/settings', { state: { activeTab: 'accounts' } })} // Pass activeTab state as 'accounts'
          >
            Accounts
          </button>
          <button
            className={`tab ${activeTab === 'myinfo' ? 'active' : ''}`}
            onClick={() => navigate('/settings', { state: { activeTab: 'myinfo' } })} // Pass activeTab state as 'myinfo'
          >
            My Info
          </button>
        </div>

        <div className="add-user-page">
          <div className="form-container">
            <div className="header-left">
              <button className="back-arrow-button" onClick={() => navigate('/settings')}>
                <IoMdArrowDropleft className="back-arrow" />
              </button>
              <h2>Add User</h2>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
              <label>First Name</label>
                <div className="input-container">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <div className="input-container">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Username</label>
                <div className="input-container">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <div className="input-container">
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-container">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <ul className="password-requirements">
                    <li className={passwordStrength.lowercase ? 'valid' : ''}>Must contain at least one Lower-case letter.</li>
                    <li className={passwordStrength.uppercase ? 'valid' : ''}>Must contain at least one Upper-case letter.</li>
                    <li className={passwordStrength.number ? 'valid' : ''}>Must contain at least one number.</li>
                    <li className={passwordStrength.length ? 'valid' : ''}>Password must be at least 8 characters long.</li>
                  </ul>
                </div>
              </div>

              <div className="form-group">
                <label>Password Confirmation</label>
                <div className="input-container">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <small>Enter the same password as before for verification.</small>
                </div>
              </div>

              {error && <p className="error">{error}</p>}

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => navigate('/settings')}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading || !passwordStrength.length || !formData.username || !formData.confirmPassword || !formData.email || !formData.firstName || !formData.lastName}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserPage;
