import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserPage.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('accounts'); // Manage the active tab
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'accounts') {
      const fetchUsers = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`);
          const data = await response.json();
          setUsers(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching users:', error);
          setLoading(false);
        }
      };

      fetchUsers();
    }
  }, [activeTab]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    setPasswordError(''); // Clear any previous errors

    try {

      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        alert('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        const errorData = await response.json();
        setPasswordError(errorData.message || 'Error changing password');
      }
    } catch (error) {
      setPasswordError('Failed to change password');
    }
  };

  if (loading && activeTab === 'accounts') {
    return <p>Loading...</p>;
  }

  return (
    <div className="settings-page">
      <div className="settings-content">
        <h2>Settings</h2>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'accounts' ? 'active' : ''}`}
            onClick={() => setActiveTab('accounts')}
          >
            Accounts
          </button>
          <button
            className={`tab ${activeTab === 'myinfo' ? 'active' : ''}`}
            onClick={() => setActiveTab('myinfo')}
          >
            My Info
          </button>
        </div>

        {activeTab === 'accounts' && (
          <div className="users-table">
            <div className="table-header">
              <h3>Select Users</h3>
              <button className="add-user" onClick={() => navigate('/add-user')}>
                Add User
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email Address</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'myinfo' && (
          <div className="my-info">
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Current Password:</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password:</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
              {passwordError && <p className="error">{passwordError}</p>}
              <button type="submit" disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
