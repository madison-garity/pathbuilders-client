import React, { useEffect, useState } from 'react';
import { CiSettings } from 'react-icons/ci'; // Settings icon
import { AiOutlineQuestionCircle, AiOutlineHeart } from 'react-icons/ai'; // Help and Heart icon
import { FiEdit, FiMenu } from 'react-icons/fi'; 
import { MdAccessTime } from 'react-icons/md'; 
import './Sidebar.css';

const Sidebar = ({ chats, onNewChat, onLoadChat }) => {

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <FiMenu className="menu-icon" />
        <FiEdit className="new-chat-placeholder" />
      </div>

      <div className="new-chat-container">
        <div className="new-chat" onClick={onNewChat}>
          <FiEdit className="new-chat-icon" /> {/* Pencil icon */}
          New Chat
        </div>
        <hr />
      </div>

       {/* Favorites Section */}
       <div className="subheader">
          <AiOutlineHeart className="icon-favorites" /> Favorites
        </div>
        {chats.favorites && chats.favorites.length === 0 && <p>No favorite chats yet.</p>}
        {chats.favorites && chats.favorites.map(chat => (
          <div key={chat.id} onClick={() => onLoadChat(chat)}>
            {chat.title}
          </div>
        ))}

      <div className="sidebar-section">
        <h4>Recent Chats</h4>

        {/* Recent Section */}
        <div className="subheader">
          <MdAccessTime className="icon-recents" /> Recent
        </div>
        {chats.recents && chats.recents.length === 0 && <p>No recent chats yet.</p>}
        {chats.recents && chats.recents.map(chat => (
          <div key={chat.id} onClick={() => onLoadChat(chat)}>
            {chat.title}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="help">
          <AiOutlineQuestionCircle className="help-icon" /> {/* Help icon */}
          Help
        </div>
        <div className="settings">
          <CiSettings className="settings-icon" /> {/* Settings icon */}
          Settings
        </div>
        <p>PATHBUILDERS® AI Assistant, 2024.</p>
      </div>
    </div>
  );
};

export default Sidebar;
