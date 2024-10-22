import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OpenAI } from 'openai';
import ReactMarkdown from 'react-markdown';
import './App.css';
import Header from './components/Header';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ChatInput from './components/ChatInput';
import LoadingIcon from './components/LoadingIcon'; // Import the loading dots component
import UsersPage from './components/UserPage'; // Import the UsersPage component
import Layout from './components/Layout'; // Import the Layout component

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [threadId, setThreadId] = useState("thread_uzGft8YU4BRtz0EdSYu7kPbO");
  const [loading, setLoading] = useState(false); // State for loading dots
  const [chats, setChats] = useState([
    { title: 'What is the Percepta program?', messages: [], isFavorite: false },
    { title: 'Top participants in 2024', messages: [], isFavorite: true },
  ]);
  const [currentChat, setCurrentChat] = useState(null); // To track the current 
  const [darkMode, setDarkMode] = useState(false); // State to track light/dark mode

  const configuration = {
    apiKey: process.env.REACT_APP_OPENAI_KEY,
    dangerouslyAllowBrowser: true
  };
  const openai = new OpenAI(configuration);

  // Function to create a thread
  const createThread = async () => {
    try {
      const response = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setThreadId(data.id); // Save the thread ID for future requests
      console.log('Thread created with ID:', data.id);
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  // Handle new chat creation
  const handleNewChat = () => {
    setMessages([]);
    setCurrentChat(null); // Clear the current chat
    createThread();
  };

  // Handle loading a previous chat
  const handleLoadChat = (chat) => {
    setMessages(chat.messages);
    setCurrentChat(chat); // Set the current chat
  };

    // Function to add a message to the thread
    const handleSendMessage = async (message) => {
      setMessages([...messages, { sender: 'user', text: message }]);
      setLoading(true); // Show loading dots
  
      try {
        const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
            'OpenAI-Beta': 'assistants=v2',
          },
          body: JSON.stringify({
            role: 'user',
            content: message,
          }),
        });
  
        console.log(response)
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('User message added to thread:', data);
        runThreadAndStreamResponse(); // Start the assistant response
      } catch (error) {
        console.error('Error adding message to thread:', error);
        setLoading(false); // Hide loading dots if there's an error
      }
    };
  
    // Function to run the thread and stream the assistant's response
    const runThreadAndStreamResponse = async () => {
      try {
        let currentText = ''; // Variable to hold the growing assistant response
        const run = openai.beta.threads.runs.stream(threadId, {
          assistant_id: 'asst_AudQ4y7QvPv8yfDJmyztvQVY', // Replace with your assistant ID
        })
          .on('textCreated', () => {
            console.log('\nAssistant is thinking...');
          })
          .on('textDelta', (textDelta, snapshot) => {
            setLoading(false); // Hide loading dots once the response starts streaming
            console.log('Streaming text:', textDelta.value);
            
            // Append the delta to the growing response
            currentText += textDelta.value;
    
            // Update the last message (assistant's message) with the streaming text
            setMessages((prevMessages) => {
              const lastMessage = prevMessages[prevMessages.length - 1];
              
              // If the last message is from the assistant, update it
              if (lastMessage.sender === 'assistant') {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1] = {
                  ...lastMessage,
                  text: currentText,
                };
                return updatedMessages;
              }
              
              // If no assistant message exists, add a new one
              return [...prevMessages, { sender: 'assistant', text: currentText }];
            });
          })
          .on('toolCallCreated', (toolCall) => {
            console.log(`\nAssistant initiated a tool call: ${toolCall.type}`);
          })
          .on('toolCallDelta', (toolCallDelta) => {
            console.log('\nTool call delta received:', toolCallDelta);
            if (toolCallDelta.type === 'code_interpreter') {
              console.log('\nCode Interpreter inputs:', toolCallDelta.code_interpreter.input);
              console.log('\nCode Interpreter outputs:', toolCallDelta.code_interpreter.outputs);
            }
          })
          .on('error', (error) => {
            console.error('Stream encountered an error:', error);
            setLoading(false); // Hide loading dots in case of an error
          });
  
          console.log(run)
      } catch (error) {
        console.error('Error running thread and streaming response:', error);
        setLoading(false); // Hide loading dots if there's an error
      }
    };

  return (
      <Routes>
        {/* Routes that use the layout (with header and sidebar) */}
        <Route path="/app" element={
          <Layout 
            chats={chats} 
            handleNewChat={handleNewChat} 
            handleLoadChat={handleLoadChat} 
            darkMode={darkMode} 
            setDarkMode={setDarkMode}
          >
            {/* Main Chat Page */}
            {messages.length === 0 && !currentChat && (
              <div className="center-content">
                <MainContent handleCardClick={handleSendMessage} darkMode={darkMode} />
              </div>
            )}
            <div className="chat-window">
              <div className="messages">
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender}`}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ))}
                {loading && <LoadingIcon />} {/* Show loading dots while waiting for the response */}
              </div>
              <ChatInput onSend={handleSendMessage} />
            </div>
          </Layout>
        } />
        
        {/* Settings / Users Page */}
        <Route path="/settings" element={
          <Layout 
            chats={chats} 
            handleNewChat={handleNewChat} 
            handleLoadChat={handleLoadChat} 
            darkMode={darkMode} 
            setDarkMode={setDarkMode}
          >
            <UsersPage />
          </Layout>
        } />

        {/* Routes without the layout (no header, no sidebar) */}
        <Route path="/" element={<Login />} /> {/* Default route for login page */}
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Forgot password route */}
        <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* Reset password route */}
      </Routes>
  );
};

export default App;
