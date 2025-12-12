// pages/MessagesPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MessagesPage.css';

const MessagesPage = ({ userData }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [voiceMode, setVoiceMode] = useState(localStorage.getItem('voiceMode') === 'true');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Demo contacts
  const contacts = [
    { id: 1, name: 'Sarah Johnson', role: 'Caregiver', avatar: '👩‍⚕️', unread: 3 },
    { id: 2, name: 'Dr. Michael Chen', role: 'Doctor', avatar: '👨‍⚕️', unread: 1 },
    { id: 3, name: 'Family Group', role: 'Family', avatar: '👨‍👩‍👧‍👦', unread: 0 },
    { id: 4, name: 'Transport Service', role: 'Service', avatar: '🚗', unread: 0 },
    { id: 5, name: 'Pharmacy', role: 'Health', avatar: '💊', unread: 0 },
  ];

  // Demo messages
  const demoMessages = [
    {
      id: 1,
      contactId: 1,
      sender: 'Sarah Johnson',
      text: 'Good morning Sam! Did you take your morning medication?',
      time: '9:30 AM',
      isSent: false,
      read: true
    },
    {
      id: 2,
      contactId: 1,
      sender: 'You',
      text: 'Yes, I took it at 8 AM with breakfast.',
      time: '9:35 AM',
      isSent: true,
      read: true
    },
    {
      id: 3,
      contactId: 1,
      sender: 'Sarah Johnson',
      text: 'Great! How are you feeling today?',
      time: '9:40 AM',
      isSent: false,
      read: true
    },
    {
      id: 4,
      contactId: 1,
      sender: 'Sarah Johnson',
      text: 'Remember we have the nurse visit at 2 PM today.',
      time: '10:15 AM',
      isSent: false,
      read: false
    },
    {
      id: 5,
      contactId: 2,
      sender: 'Dr. Michael Chen',
      text: 'Your blood test results are in. Everything looks good!',
      time: 'Yesterday, 3:45 PM',
      isSent: false,
      read: false
    },
    {
      id: 6,
      contactId: 3,
      sender: 'Family Group',
      text: 'Mom, we\'ll visit you this Sunday at 4 PM.',
      time: '2 days ago',
      isSent: false,
      read: true
    },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setMessages(demoMessages);
      setIsLoading(false);
      
      // Select first contact by default
      if (contacts.length > 0) {
        setSelectedContact(contacts[0]);
      }
    }, 500);
  }, []);

  /*useEffect(() => {
    // Scroll to bottom when messages change
   /* scrollToBottom();
    
    // Read out new messages in voice mode
    if (voiceMode && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.isSent && !lastMessage.read) {
        speakText(`New message from ${lastMessage.sender}: ${lastMessage.text}`);
      }
    }
  }, [messages, voiceMode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }; */

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedContact) return;

    const newMsg = {
      id: messages.length + 1,
      contactId: selectedContact.id,
      sender: 'You',
      text: newMessage,
      time: 'Just now',
      isSent: true,
      read: true
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simulate reply after 2 seconds
    setTimeout(() => {
      const replies = [
        'Thanks for letting me know!',
        'I\'ll check on that right away.',
        'That\'s great to hear!',
        'I\'ve made a note of that.',
        'Take care and let me know if you need anything else.'
      ];
      
      const reply = {
        id: messages.length + 2,
        contactId: selectedContact.id,
        sender: selectedContact.name,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: 'Just now',
        isSent: false,
        read: false
      };
      
      setMessages(prev => [...prev, reply]);
      
      // Provide haptic feedback
      if (navigator.vibrate) navigator.vibrate(100);
      
      // Announce new message in voice mode
      if (voiceMode) {
        speakText(`New message from ${selectedContact.name}`);
      }
    }, 2000);
  };

  const handleVoiceMessage = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser. Please type your message.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.start();
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNewMessage(transcript);
      
      // Provide feedback
      if (navigator.vibrate) navigator.vibrate(50);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      alert('Voice input failed. Please try typing instead.');
    };
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    
    // Mark messages as read
    setMessages(messages.map(msg => 
      msg.contactId === contact.id && !msg.isSent 
        ? { ...msg, read: true } 
        : msg
    ));
    
    // Announce in voice mode
    if (voiceMode) {
      speakText(`Now chatting with ${contact.name}, ${contact.role}`);
    }
    
    // Provide haptic feedback
    if (navigator.vibrate) navigator.vibrate(30);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleEmergencyCall = () => {
    if (selectedContact) {
      speakText(`Calling ${selectedContact.name}...`);
      alert(`Calling ${selectedContact.name}...\nPhone: (555) 123-4567`);
    } else {
      alert('Please select a contact to call.');
    }
  };

  if (isLoading) {
    return (
      <div className="messages-loading">
        <div className="loading-spinner"></div>
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="messages-container">
      {/* Header */}
      <header className="messages-header">
        <button 
          className="back-button"
          onClick={handleBackToDashboard}
          aria-label="Back to dashboard"
        >
          ← Back
        </button>
        <h1 className="messages-title">Messages</h1>
        <div className="header-actions">
          <button 
            className="voice-toggle"
            onClick={() => setVoiceMode(!voiceMode)}
            aria-label={voiceMode ? "Turn off voice mode" : "Turn on voice mode"}
          >
            {voiceMode ? '🔊 On' : '🔊 Off'}
          </button>
        </div>
      </header>

      <div className="messages-layout">
        {/* Contacts Sidebar */}
        <div className="contacts-sidebar">
          <h2 className="sidebar-title">Contacts</h2>
          <div className="contacts-list">
            {contacts.map(contact => (
              <button
                key={contact.id}
                className={`contact-item ${selectedContact?.id === contact.id ? 'active' : ''}`}
                onClick={() => handleContactSelect(contact)}
                aria-label={`Chat with ${contact.name}, ${contact.role}`}
                aria-pressed={selectedContact?.id === contact.id}
              >
                <div className="contact-avatar">{contact.avatar}</div>
                <div className="contact-info">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-role">{contact.role}</div>
                </div>
                {contact.unread > 0 && (
                  <div className="unread-badge" aria-label={`${contact.unread} unread messages`}>
                    {contact.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
          
          {/* Quick Actions */}
          <div className="quick-actions">
            <button 
              className="quick-action emergency-call"
              onClick={handleEmergencyCall}
              aria-label="Emergency call"
            >
              <span className="action-icon">📞</span>
              <span className="action-text">Emergency Call</span>
            </button>
            <button 
              className="quick-action add-contact"
              onClick={() => alert('Add contact feature')}
              aria-label="Add new contact"
            >
              <span className="action-icon">➕</span>
              <span className="action-text">Add Contact</span>
            </button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="chat-area">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-contact">
                  <div className="chat-avatar">{selectedContact.avatar}</div>
                  <div>
                    <h2 className="chat-name">{selectedContact.name}</h2>
                    <p className="chat-role">{selectedContact.role}</p>
                  </div>
                </div>
                <div className="chat-actions">
                  <button 
                    className="chat-action"
                    onClick={handleEmergencyCall}
                    aria-label={`Call ${selectedContact.name}`}
                  >
                    📞 Call
                  </button>
                  <button 
                    className="chat-action"
                    onClick={() => alert('Video call feature')}
                    aria-label={`Video call with ${selectedContact.name}`}
                  >
                    📹 Video
                  </button>
                </div>
              </div>

              {/* Messages Container */}
              <div className="messages-list" aria-live="polite">
                {messages
                  .filter(msg => msg.contactId === selectedContact.id)
                  .map(message => (
                    <div
                      key={message.id}
                      className={`message-bubble ${message.isSent ? 'sent' : 'received'} ${!message.read && !message.isSent ? 'unread' : ''}`}
                      aria-label={`${message.isSent ? 'You said' : `${message.sender} said`}: ${message.text} at ${message.time}`}
                    >
                      {!message.isSent && (
                        <div className="message-sender">{message.sender}</div>
                      )}
                      <div className="message-text">{message.text}</div>
                      <div className="message-time">{message.time}</div>
                      {message.isSent && (
                        <div className="message-status">
                          {message.read ? '✓✓' : '✓'}
                        </div>
                      )}
                    </div>
                  ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form className="message-input-form" onSubmit={handleSendMessage}>
                <div className="input-container">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="message-input"
                    aria-label="Type your message"
                    autoFocus
                  />
                  <div className="input-actions">
                    <button
                      type="button"
                      className="voice-input-button"
                      onClick={handleVoiceMessage}
                      aria-label="Voice input"
                    >
                      🎤
                    </button>
                    <button
                      type="button"
                      className="emoji-button"
                      onClick={() => alert('Emoji picker')}
                      aria-label="Open emoji picker"
                    >
                      😊
                    </button>
                    <button
                      type="submit"
                      className="send-button"
                      disabled={!newMessage.trim()}
                      aria-label="Send message"
                    >
                      Send
                    </button>
                  </div>
                </div>
                
                {/* Accessibility Features */}
                <div className="accessibility-tips">
                  <p className="tip">
                    <strong>Tip:</strong> Press and hold the microphone button to speak your message.
                  </p>
                  <p className="tip">
                    <strong>Accessibility:</strong> All messages are read aloud when voice mode is on.
                  </p>
                </div>
              </form>
            </>
          ) : (
            <div className="no-contact-selected">
              <div className="no-contact-icon">💬</div>
              <h2>Select a contact to start chatting</h2>
              <p>Choose someone from the contacts list on the left</p>
            </div>
          )}
        </div>
      </div>

      {/* Accessibility Announcements */}
      {voiceMode && (
        <div className="voice-announcement" aria-live="assertive">
          Voice mode is active. New messages will be read aloud.
        </div>
      )}
    </div>
  );
};

export default MessagesPage;