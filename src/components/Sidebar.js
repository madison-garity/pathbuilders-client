import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CiSettings } from 'react-icons/ci';
import { AiOutlineQuestionCircle, AiOutlineHeart } from 'react-icons/ai';
import { FiEdit, FiMenu, FiMoreVertical } from 'react-icons/fi';
import { MdAccessTime } from 'react-icons/md';
import './Sidebar.css';

const Sidebar = ({ chats, onLoadChat, setChats, setCurrentChat, setMessages }) => {
  const [menuOpen, setMenuOpen] = useState(null); // Tracks which chat's menu is open
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 }); // To dynamically position the popup
  const menuRef = useRef(null);

  const handleToggleFavorite = async (chatId, isFavorite) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + `/api/chats/${chatId}/favorite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite }),
      });

      if (response.ok) {
        console.log(`Chat ${chatId} favorite status updated to ${isFavorite}`);
        
        // Update the sidebar chats with new favorite status
        updateFavoriteStatus(chatId, isFavorite);
        setMenuOpen(null); // Close the menu after updating
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  // Update the sidebar lists when a chat is favorited or unfavorited
  const updateFavoriteStatus = (chatId, isFavorite) => {
    setChats((prevChats) => {
      let updatedChat = null;

      // Update favorites list
      let favorites = prevChats.favorites.filter(chat => {
        if (chat.id === chatId) {
          updatedChat = { ...chat, isFavorite };
          return false; // Remove if unfavorited
        }
        return true;
      });

      // Update recents list
      let recents = prevChats.recents.filter(chat => {
        if (chat.id === chatId) {
          updatedChat = { ...chat, isFavorite };
          return false; // Remove if favorited
        }
        return true;
      });

      // Add updated chat to the appropriate list
      if (isFavorite) {
        favorites = [updatedChat, ...favorites];
      } else {
        recents = [updatedChat, ...recents];
      }

      return { favorites, recents };
    });
  };

  const handleMenuClick = (event, chat) => {
    const rect = event.target.getBoundingClientRect(); // Get the position of the three-dot icon
    setPopupPosition({
      top: rect.bottom + window.scrollY, // Set the position relative to the viewport
      left: rect.left + window.scrollX,
    });
    setMenuOpen(menuOpen === chat.id ? null : chat.id); // Toggle open/close
  };

  // Close the menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null); // Close the menu if clicking outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  // Render the popup using React Portal
  const renderMenuPopup = (chat, isFavorite) => {
    return createPortal(
      <div
        className="menu-popup"
        ref={menuRef}
        style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }}
      >
        <div onClick={() => handleToggleFavorite(chat.id, !isFavorite)}>
          {isFavorite ? 'Unfavorite' : 'Favorite'}
        </div>
      </div>,
      document.body // Render the popup in the body to avoid overflow issues
    );
  };

  const renderThreeDotMenu = (chat, isFavorite) => (
    <div className="three-dot-menu" onClick={(e) => e.stopPropagation()}>
      <FiMoreVertical
        className="three-dot-icon"
        onClick={(e) => handleMenuClick(e, chat)} // Calculate popup position and toggle
      />
      {menuOpen === chat.id && renderMenuPopup(chat, isFavorite)}
    </div>
  );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <FiMenu className="menu-icon" />
        <FiEdit className="new-chat-placeholder" />
      </div>

      <div className="new-chat-container">
        <div className="new-chat" onClick={() => {setCurrentChat(null); setMessages([])}}>
          <FiEdit className="new-chat-icon" /> New Chat
        </div>
        <hr />
      </div>

      {/* Favorites Section */}
      <div className="sidebar-section">
      <h4>Previous Chats</h4>
      <div className="subheader">
        <AiOutlineHeart className="icon-favorites" /> Favorites
      </div>
      {chats.favorites && chats.favorites.length === 0 && <p>No favorite chats yet.</p>}
      {chats.favorites &&
        chats.favorites.map((chat) => (
          <div className="chat-container" key={chat.id} title={chat.name}>
            <div className="chat-item" onClick={() => onLoadChat(chat)}>
              {chat.name}
            </div>
            {renderThreeDotMenu(chat, true)} {/* Render three-dot menu */}
          </div>
        ))}
        </div>

      {/* Recent Section */}
      <div className="sidebar-section">
        
        <div className="subheader">
          <MdAccessTime className="icon-recents" /> Recent
        </div>
        {chats.recents && chats.recents.length === 0 && <p>No recent chats yet.</p>}
        {chats.recents &&
          chats.recents.map((chat) => (
            <div className="chat-container" key={chat.id} title={chat.name}>
              <div className="chat-item" onClick={() => onLoadChat(chat)}>
                {chat.name}
              </div>
              {renderThreeDotMenu(chat, false)} {/* Render three-dot menu */}
            </div>
          ))}
      </div>

      <div className="sidebar-footer">
        <a className="settings" href='/settings'>
          <CiSettings className="settings-icon" /> Settings
        </a>
        <p>PATHBUILDERS® AI Assistant, 2024.</p>
      </div>
    </div>
  );
};

export default Sidebar;
