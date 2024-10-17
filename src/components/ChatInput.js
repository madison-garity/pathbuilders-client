import React, { useState } from 'react';
import { FaArrowUp } from 'react-icons/fa'; // Import the up arrow from react-icons/fa
import './ChatInput.css';

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput(''); // Clear the input field after sending
    }
  };

  return (
    <div className="chat-input-container">
      <form onSubmit={handleSend} className="chat-input">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask me anything..."
        />
        <button type="submit" disabled={!input.trim()} className={!input.trim() ? 'disabled' : ''}>
          <FaArrowUp size={16} color={input.trim() ? 'white' : 'gray'} /> {/* Gray out the icon if disabled */}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
