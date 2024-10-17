import React, { useEffect, useState } from 'react';
import { CiSettings } from 'react-icons/ci'; // Settings icon
import { AiOutlineQuestionCircle, AiOutlineHeart } from 'react-icons/ai'; // Help and Heart icon
import { FiEdit, FiMenu } from 'react-icons/fi'; 
import { MdAccessTime } from 'react-icons/md'; 
import './Sidebar.css';

const Sidebar = ({ onNewChat, onLoadChat }) => {
  // State to store chats fetched from the database
  const [chats, setChats] = useState([]);

  // Fetch chats when component loads
  useEffect(() => {
    const fetchChats = async () => {
      try {
        // Use the Fetch API to get the chats from the backend
        const response = await fetch('http://localhost:5000/api/chats'); // Adjust the URL as necessary
        if (!response.ok) {
          throw new Error('Failed to fetch chats');
        }
        const data = await response.json(); // Parse the JSON from the response
        setChats(data); // Store chats in state
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []); // Empty dependency array ensures this runs only once when the component is mounted

  // Separate chats into recent and favorites based on isFavorite property
  const recentChats = chats.filter(chat => !chat.isFavorite);
  const favoriteChats = chats.filter(chat => chat.isFavorite);

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
      <div className="sidebar-section">
        <h4>Previous Chats</h4>

        {/* Recent Section */}
        <div className="subheader">
          <MdAccessTime className="icon-recents" /> Recent
        </div>
        {recentChats.map((chat, index) => (
          <div key={index} className="chat-item" onClick={() => onLoadChat(chat)}>
            {chat.title}
          </div>
        ))}

        {/* Favorites Section */}
        <div className="subheader">
          <AiOutlineHeart className="icon-favorites" /> Favorites
        </div>
        {favoriteChats.map((chat, index) => (
          <div key={index} className="chat-item" onClick={() => onLoadChat(chat)}>
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
