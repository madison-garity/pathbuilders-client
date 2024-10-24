import React, { useState, useEffect } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FiUserPlus } from 'react-icons/fi';
import { IoMdArrowDropleft } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './UserPage.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('accounts');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (activeTab === 'accounts') {
      const fetchUsers = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`);
          const data = await response.json();
          setUsers(data);
          setFilteredUsers(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching users:', error);
          setLoading(false);
        }
      };
      fetchUsers();
    } else {
      const fetchUser = async () => {
        try {
          const user = JSON.parse(localStorage.getItem('user'));
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${user.id}`);
          const data = await response.json();
          setUser(data);
        } catch (error) {
          console.error('Error fetching user:', error);
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [activeTab]);

  useEffect(() => {
    // Check if activeTab state is passed and set it accordingly
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    if (search) {
      setFilteredUsers(
        users.filter(user =>
          user.username.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [search, users]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    setPasswordError('');

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

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading && activeTab === 'accounts') {
    return <p>Loading...</p>;
  }

  return (
    <div className="settings-page">
      <div className="settings-content">
        <h1>Settings</h1>
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
            <div className="header-left">
            <button className="back-arrow-button" onClick={() => navigate('/app')}>
              <IoMdArrowDropleft className="back-arrow" />
            </button>
              <h2>Users</h2>
            </div>
            <button className="add-user" onClick={() => navigate('/add-user')}>
              <FiUserPlus className="user-icon" /> Add User
            </button>
          </div>

            <div className="search-bar">
              <AiOutlineSearch className="search-icon" /> {/* Add the search icon */}
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
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
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="pagination">
              {[...Array(Math.ceil(filteredUsers.length / usersPerPage)).keys()].map((number) => (
                <button key={number} onClick={() => paginate(number + 1)} className={currentPage === number + 1 ? 'active-page' : ''}>
                  {number + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'myinfo' && (
          <div className="my-info">
          <div className="table-header">
            <div className="header-left">
              <button className="back-arrow-button" onClick={() => navigate('/app')}>
                <IoMdArrowDropleft className="back-arrow" />
              </button>
              <h2>My Info</h2>
            </div>
          </div>
            <form onSubmit={handlePasswordChange}>

              <div className="form-group">
                <label>Name:</label>
                <div className="input-container">
                  <input
                    type="firstName"
                    value={user.firstName + ' ' + user.lastName}
                    disabled
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Username:</label>
                <div className="input-container">
                  <input
                    type="username"
                    value={user.username}
                    disabled
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email:</label>
                <div className="input-container">
                  <input
                    type="email"
                    value={user.email}
                    disabled
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password:</label>
                <div className="input-container">
                  <h3>Current Password</h3>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <h3>New Password</h3>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />

                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              {passwordError && <p className="error">{passwordError}</p>}
              <div className="form-actions">
                <button type="submit" className='submit-btn' disabled={!currentPassword || !newPassword || !confirmNewPassword}>Change Password</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
