import React from 'react';
import { MdManageSearch } from 'react-icons/md'; // Importing the search icon
import { PiPencilSimpleLine } from "react-icons/pi";
import { CgFileDocument } from "react-icons/cg";
import './MainContent.css';
import logoLight from '../assets/logo-light.png'; // Import light mode logo
import logoDark from '../assets/logo-dark.png'; // Import dark mode logo

const MainContent = ({ handleCardClick, darkMode }) => {
  return (
    <div className="main-content">
      <div className="content-header">
      <img 
          src={darkMode ? logoDark : logoLight} 
          alt="Logo" 
          className="logo" 
        />
        <h1>How May I Assist?</h1>
        <p>Here are some ideas to help get you started.</p>
      </div>
      <div className="suggestions">
        <div
          className="suggestion-card"
          onClick={() => handleCardClick('How many participated in Stage Two: Percepta?')}
        >
          <MdManageSearch className="icon" /> {/* Add icon */}
          <h3>Research</h3>
          <p>How many participated in Stage Two: Percepta?</p>
        </div>
        <div
          className="suggestion-card"
          onClick={() => handleCardClick('Tell me the top 5 benefits of our program Achieva.')}
        >
          <CgFileDocument className="icon" /> {/* Add icon */}
          <h3>Summarize Data</h3>
          <p>Tell me the top 5 benefits of our program Achieva.</p>
        </div>
        <div
          className="suggestion-card"
          onClick={() => handleCardClick('Write a 300-word draft highlighting our top program.')}
        >
          <PiPencilSimpleLine className="icon" /> {/* Add icon */}
          <h3>Draft an Article</h3>
          <p>Write a 300-word draft highlighting our top program.</p>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
