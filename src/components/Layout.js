import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import '../App.css';

const Layout = ({ children, currentChat, setChats, setCurrentChat, setMessages, chats, handleLoadChat, darkMode, setDarkMode, user }) => {
  return (
    <div className="app">
      <Sidebar chats={chats} onLoadChat={handleLoadChat} setChats={setChats} setCurrentChat={setCurrentChat} setMessages={setMessages} currentChat={currentChat} />
      <div className='main'>
        <div className="main-content-area">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
