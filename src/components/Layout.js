import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import '../App.css';

const Layout = ({ children, setChats, setCurrentChat, setMessages, chats, handleLoadChat, darkMode, setDarkMode, user }) => {
  return (
    <div className="app">
      <Sidebar chats={chats} onLoadChat={handleLoadChat} setChats={setChats} setCurrentChat={setCurrentChat} setMessages={setMessages} />
      <div className='main'>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} user={user} />
        <div className="main-content-area">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
