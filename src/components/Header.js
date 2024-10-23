import React, { useState } from 'react';
import { BsSun, BsMoon } from 'react-icons/bs'; // Sun and Moon icons for light/dark mode
import './Header.css';

const Header = ({darkMode, setDarkMode, user}) => {
  // Toggle between light and dark mode
  const handleToggle = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode'); // Add/remove a class from the body for dark mode
  };

  return (
    <header className="header">
      <div className="branding">
        <h1>PATHBUILDERS® AI Assistant</h1> {/* Branding */}
      </div>

      <div className="header-icons">
        <div className="toggle-mode" onClick={handleToggle}>
          {darkMode ? <BsSun size={24} /> : <BsMoon size={24} />} {/* Light/Dark Mode Icons */}
        </div>
        <div className="profile">
        <span className="profile-icon">{user.firstName[0]}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
