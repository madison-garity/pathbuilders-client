import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import '../App.css';

const Layout = ({ children, chats, handleNewChat, handleLoadChat, darkMode, setDarkMode }) => {
  return (
    <div className="app">
      <Sidebar chats={chats} onNewChat={handleNewChat} onLoadChat={handleLoadChat} />
      <div className='main'>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="main-content-area">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
