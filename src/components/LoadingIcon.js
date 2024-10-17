import React from 'react';
import { BiDotsHorizontalRounded } from 'react-icons/bi'; // Import the dots icon
import './LoadingIcon.css'; // Import your animation styles

const LoadingDots = () => {
  return (
    <div className="loading-dots">
      <BiDotsHorizontalRounded className="loading-icon" />
    </div>
  );
};

export default LoadingDots;
