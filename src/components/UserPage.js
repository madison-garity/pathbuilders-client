import React, { useState, useEffect } from 'react';
import './UserPage.css'; // This will contain the styles

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users from API
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="settings-page">
      <div className="settings-content">
        <h2>Settings</h2>
        <div className="tabs">
          <button className="tab active">Accounts</button>
          <button className="tab">My Info</button>
        </div>

        <div className="users-table">
          <div className="table-header">
            <h3>Select Users</h3>
            <button className="add-user">Add User</button>
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
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
