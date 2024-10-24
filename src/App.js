import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OpenAI } from 'openai';
import ReactMarkdown from 'react-markdown';
import { useEffect } from 'react';
import './App.css';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import MainContent from './components/MainContent';
import ChatInput from './components/ChatInput';
import LoadingIcon from './components/LoadingIcon'; // Import the loading dots component
import UsersPage from './components/UserPage'; // Import the UsersPage component
import Layout from './components/Layout'; // Import the Layout component
import AddUser from './components/AddUser'; // Import the AddUser component
import Header from './components/Header'; // Import the Header component

const App = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading dots
  const [chats, setChats] = useState([
    { title: 'What is the Percepta program?', messages: [], isFavorite: false },
    { title: 'Top participants in 2024', messages: [], isFavorite: true },
  ]);
  const [currentChat, setCurrentChat] = useState(null); // To track the current 
  const [darkMode, setDarkMode] = useState(false); // State to track light/dark mode
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const configuration = {
    apiKey: process.env.REACT_APP_OPENAI_KEY,
    dangerouslyAllowBrowser: true
  };
  const openai = new OpenAI(configuration);

  const messagesEndRef = useRef(null); // Ref to the last message

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to the bottom whenever the messages array changes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chats?userId=${user.id}`, { 
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        const data = await response.json();
  
        // Group by favorites and recents, then sort by updatedAt
        const favorites = data.filter(chat => chat.isFavorite).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        const recents = data.filter(chat => !chat.isFavorite).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setChats({ favorites, recents });
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);
  

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
      
      console.log('Thread created with ID:', data.id);
      return data.id;
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (message) => {
    setLoading(true);
    const newMessages = [...messages, { sender: 'user', text: message }];
    setMessages(newMessages);
  
    let thread = null;
    let newChat = null;
  
    if (!currentChat) {
      try {
        thread = await createThread(); // Make sure this is awaited
  
        if (!thread) {
          console.error('Failed to create thread');
          setLoading(false);
          return; // Stop further execution if thread creation failed
        }
  
        const chatResponse = await fetch(process.env.REACT_APP_API_URL + '/api/chats-with-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: message,
            thread_id: thread, // Use the actual thread ID now
            userId: user.id,  // Set your actual user ID here
            text: message,    
          }),
        });
  
        const { chat, message: createdMessage } = await chatResponse.json();
        newChat = chat;
        setCurrentChat(chat); // Set the new chat as current
        updateSidebarChats(chat); // Update sidebar with new chat
      } catch (error) {
        console.error('Error creating new chat or adding message:', error);
        setLoading(false);
      }
    } else {
      try {
        thread = currentChat.thread_id;
        const chatResponse = await fetch(process.env.REACT_APP_API_URL + `/api/chats/${currentChat.id}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender: 'user',
            text: message,
          }),
        });
        newChat = currentChat;
      } catch (error) {
        console.error('Error adding message to existing chat:', error);
        setLoading(false);
      }
    }
  
    const response = await fetch(`https://api.openai.com/v1/threads/${thread}/messages`, {
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
  
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    runThreadAndStreamResponse(newChat)
    setLoading(false);
  };
  
  
  // Fetch messages for the selected chat
  const handleLoadChat = async (chat) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + `/api/chats/${chat.id}/messages`);
      const messagesData = await response.json();
      setMessages(messagesData);
      setCurrentChat(chat); // Track current chat
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Update the sidebar when a new chat is created
  const updateSidebarChats = (newChat) => {
    const updatedChats = [...chats.recents, newChat].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    setChats({
      favorites: chats.favorites,
      recents: updatedChats,
    });
  };

  const runThreadAndStreamResponse = async (chat) => {
    try {
      let currentText = ''; // Variable to hold the growing assistant response
      let lastDeltaTime = Date.now(); // Track the time of the last delta
  
      const run = openai.beta.threads.runs.stream(chat.thread_id, {
        assistant_id: process.env.REACT_APP_ASSISTANT_ID,
        max_completion_tokens: 500,  // Adjust this based on your needs
        temperature: 1.0,
        top_p: 1.0,
      })
        .on('textCreated', () => {
          console.log('\nAssistant is thinking...');
        })
        .on('textDelta', async (textDelta, snapshot) => {
          lastDeltaTime = Date.now(); // Update time when a new delta arrives
          currentText += textDelta.value;
  
          // Update messages in the UI
          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
  
            if (lastMessage && lastMessage.sender === 'assistant') {
              const updatedMessages = [...prevMessages];
              updatedMessages[updatedMessages.length - 1] = {
                ...lastMessage,
                text: currentText,
              };
              return updatedMessages;
            }
  
            return [...prevMessages, { sender: 'assistant', text: currentText }];
          });
        })
        .on('textDone', async (content, snapshot) => {
          console.log("textDone:", JSON.stringify(content));
          await saveAssistantMessageToDB(currentText, chat);
        })
        .on('error', (error) => {
          console.error('Stream encountered an error:', error);
          setLoading(false);
        });
  
    } catch (error) {
      console.error('Error running thread and streaming response:', error);
      setLoading(false);
    }
  };
  
  // Function to save the final assistant message to the database
  const saveAssistantMessageToDB = async (message, chat) => {
    try {
      console.log(chat)
      await fetch(`${process.env.REACT_APP_API_URL}/api/chats/${chat.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: message,
          sender: 'assistant',
        }),
      });
      console.log('Assistant message saved successfully.');
    } catch (error) {
      console.error('Error saving assistant message to database:', error);
    }
  };

  return (
      <Routes>
        {/* Routes that use the layout (with header and sidebar) */}
        <Route path="/app" element={
          <ProtectedRoute user={user}>
          <Layout 
            chats={chats}
            currentChat={currentChat} 
            setChats={setChats}
            handleLoadChat={handleLoadChat} 
            darkMode={darkMode} 
            setDarkMode={setDarkMode}
            setCurrentChat={setCurrentChat}
            setMessages={setMessages}
            user={user}
          >
            
          <Header darkMode={darkMode} setDarkMode={setDarkMode} user={user} />
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
                {/* This div will always be at the bottom of the messages */}
                <div ref={messagesEndRef} />
              </div>
              <ChatInput onSend={handleSendMessage} />
            </div>
          </Layout>
          </ProtectedRoute>
        } />
        
        {/* Settings / Users Page */}
        <Route path="/settings" element={
          <ProtectedRoute user={user}>
          <Layout 
            chats={chats} 
            currentChat={currentChat} 
            setChats={setChats}
            handleLoadChat={handleLoadChat} 
            darkMode={darkMode} 
            setDarkMode={setDarkMode}
            setCurrentChat={setCurrentChat}
            setMessages={setMessages}
            user={user}
          >
            <UsersPage />
          </Layout>
          </ProtectedRoute>
        
      } />
          <Route path="/add-user" element={
                    <ProtectedRoute user={user}>
                    <Layout 
                      chats={chats} 
                      setChats={setChats}
                      currentChat={currentChat} 
                      handleLoadChat={handleLoadChat} 
                      darkMode={darkMode} 
                      setDarkMode={setDarkMode}
                      setCurrentChat={setCurrentChat}
                      setMessages={setMessages}
                      user={user}
                    >
                      <AddUser />
                    </Layout>
                    </ProtectedRoute>
          } />
        {/* Routes without the layout (no header, no sidebar) */}
        <Route path="/" element={<Login setUser={setUser}/>} /> {/* Default route for login page */}
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Forgot password route */}
        <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* Reset password route */}
      </Routes>
  );
};

export default App;
