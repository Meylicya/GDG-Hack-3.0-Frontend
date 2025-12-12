// pages/MessagesPage.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./MessagesPage.css";

const MessagesPage = ({ userData }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [voiceMode, setVoiceMode] = useState(
    localStorage.getItem("voiceMode") === "true"
  );
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Enhanced demo contacts with more variety
  const contacts = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Primary Caregiver",
      avatar: "👩‍⚕️",
      unread: 2,
      specialty: "Nursing",
      lastMessage: "Don't forget your medication reminder!",
      online: true,
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      role: "Family Doctor",
      avatar: "👨‍⚕️",
      unread: 1,
      specialty: "Internal Medicine",
      lastMessage: "Your test results are ready",
      online: false,
    },
    {
      id: 3,
      name: "Emma Wilson",
      role: "Physical Therapist",
      avatar: "🦵",
      unread: 0,
      specialty: "PT",
      lastMessage: "Great progress on your exercises!",
      online: true,
    },
    {
      id: 4,
      name: "Family Support Group",
      role: "Family Group",
      avatar: "👨‍👩‍👧‍👦",
      unread: 3,
      specialty: "Family",
      lastMessage: "Weekly check-in reminder",
      online: false,
    },
    {
      id: 5,
      name: "MediCare Pharmacy",
      role: "Pharmacy",
      avatar: "💊",
      unread: 0,
      specialty: "Pharmacy",
      lastMessage: "Prescription refill ready",
      online: true,
    },
    {
      id: 6,
      name: "City Transport",
      role: "Transportation",
      avatar: "🚗",
      unread: 1,
      specialty: "Transport",
      lastMessage: "Ride scheduled for tomorrow",
      online: false,
    },
    {
      id: 7,
      name: "HomeCare Services",
      role: "Home Services",
      avatar: "🏠",
      unread: 0,
      specialty: "Cleaning",
      lastMessage: "Weekly cleaning scheduled",
      online: true,
    },
    {
      id: 8,
      name: "Nutritionist Lisa",
      role: "Dietitian",
      avatar: "🥗",
      unread: 2,
      specialty: "Nutrition",
      lastMessage: "Meal plan for next week",
      online: false,
    },
  ];

  // Comprehensive demo messages for each contact
  const demoMessages = {
    1: [
      // Sarah Johnson (Primary Caregiver)
      {
        id: 1,
        sender: "Sarah Johnson",
        text: "Good morning Sam! Did you take your morning medication at 8 AM?",
        time: "9:30 AM",
        isSent: false,
        read: true,
      },
      {
        id: 2,
        sender: "You",
        text: "Yes, I took it at 8 AM with breakfast. Feeling good today!",
        time: "9:35 AM",
        isSent: true,
        read: true,
      },
      {
        id: 3,
        sender: "Sarah Johnson",
        text: "That's great to hear! Remember your physical therapy session at 2 PM today. I'll be there to assist you.",
        time: "9:40 AM",
        isSent: false,
        read: true,
      },
      {
        id: 4,
        sender: "You",
        text: "Thank you Sarah. I'll be ready. Should I prepare anything special?",
        time: "9:45 AM",
        isSent: true,
        read: true,
      },
      {
        id: 5,
        sender: "Sarah Johnson",
        text: "Just wear comfortable clothes and bring your water bottle. We'll work on your leg exercises today. See you at 2!",
        time: "9:50 AM",
        isSent: false,
        read: false,
      },
    ],
    2: [
      // Dr. Michael Chen
      {
        id: 6,
        sender: "Dr. Michael Chen",
        text: "Good morning Sam. Your recent blood work results came back excellent! Your cholesterol levels have improved significantly.",
        time: "Yesterday, 10:15 AM",
        isSent: false,
        read: true,
      },
      {
        id: 7,
        sender: "You",
        text: "That's wonderful news, Doctor! Thank you for letting me know.",
        time: "Yesterday, 10:30 AM",
        isSent: true,
        read: true,
      },
      {
        id: 8,
        sender: "Dr. Michael Chen",
        text: "You're welcome! Keep up the healthy lifestyle. Your next check-up is scheduled for next month. Any questions in the meantime?",
        time: "Yesterday, 10:35 AM",
        isSent: false,
        read: false,
      },
    ],
    3: [
      // Emma Wilson (PT)
      {
        id: 9,
        sender: "Emma Wilson",
        text: "Hi Sam! Great work during our session yesterday. Your mobility has improved by 30%! Keep practicing those exercises at home.",
        time: "2 days ago",
        isSent: false,
        read: true,
      },
      {
        id: 10,
        sender: "You",
        text: "Thank you Emma! I can definitely feel the difference. The exercises are getting easier.",
        time: "2 days ago",
        isSent: true,
        read: true,
      },
      {
        id: 11,
        sender: "Emma Wilson",
        text: "That's exactly what we want to hear! Remember to do 10 minutes of walking daily. Next session is this Friday at 3 PM.",
        time: "2 days ago",
        isSent: false,
        read: true,
      },
    ],
    4: [
      // Family Support Group
      {
        id: 12,
        sender: "Family Support Group",
        text: "Weekly family check-in reminder: How is everyone doing this week? Any updates or concerns to share?",
        time: "3 days ago",
        isSent: false,
        read: true,
      },
      {
        id: 13,
        sender: "You",
        text: "Doing well! Physical therapy is going great and my energy levels are up. Thanks for checking in!",
        time: "3 days ago",
        isSent: true,
        read: true,
      },
      {
        id: 14,
        sender: "Family Support Group",
        text: "Wonderful to hear! We're all so proud of your progress. Remember the family gathering this weekend?",
        time: "3 days ago",
        isSent: false,
        read: false,
      },
    ],
    5: [
      // MediCare Pharmacy
      {
        id: 15,
        sender: "MediCare Pharmacy",
        text: "Your prescription refill for Lisinopril is ready for pickup. It will be held at the counter until 6 PM today.",
        time: "4 days ago",
        isSent: false,
        read: true,
      },
      {
        id: 16,
        sender: "You",
        text: "Thank you! I'll pick it up this afternoon.",
        time: "4 days ago",
        isSent: true,
        read: true,
      },
    ],
    6: [
      // City Transport
      {
        id: 17,
        sender: "City Transport",
        text: "Your medical transport to City Hospital is confirmed for tomorrow at 9:00 AM. The driver will arrive 15 minutes early.",
        time: "5 days ago",
        isSent: false,
        read: true,
      },
      {
        id: 18,
        sender: "You",
        text: "Perfect, thank you for the confirmation.",
        time: "5 days ago",
        isSent: true,
        read: true,
      },
      {
        id: 19,
        sender: "City Transport",
        text: "You're welcome! Driver: Maria Gonzalez. Vehicle: Blue van #247. Call this number if you need to reschedule.",
        time: "5 days ago",
        isSent: false,
        read: false,
      },
    ],
    7: [
      // HomeCare Services
      {
        id: 20,
        sender: "HomeCare Services",
        text: "Your weekly cleaning service is scheduled for tomorrow at 10 AM. We'll focus on kitchen and bathroom deep cleaning.",
        time: "1 week ago",
        isSent: false,
        read: true,
      },
    ],
    8: [
      // Nutritionist Lisa
      {
        id: 21,
        sender: "Nutritionist Lisa",
        text: "Hi Sam! I've prepared your meal plan for next week. Focus on more vegetables and lean proteins. Here's what I recommend:",
        time: "6 days ago",
        isSent: false,
        read: true,
      },
      {
        id: 22,
        sender: "Nutritionist Lisa",
        text: "• Breakfast: Oatmeal with berries and nuts\n• Lunch: Grilled chicken salad\n• Dinner: Baked salmon with quinoa\n• Snacks: Greek yogurt and fruit",
        time: "6 days ago",
        isSent: false,
        read: false,
      },
    ],
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      // Load messages for first contact by default
      if (contacts.length > 0) {
        const firstContact = contacts[0];
        setSelectedContact(firstContact);
        setMessages(demoMessages[firstContact.id] || []);
      }
      setIsLoading(false);
    }, 500);
  }, []);

  // Load messages when contact is selected
  useEffect(() => {
    if (selectedContact) {
      setMessages(demoMessages[selectedContact.id] || []);
    }
  }, [selectedContact]);

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
    if ("speechSynthesis" in window) {
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
      sender: "You",
      text: newMessage,
      time: "Just now",
      isSent: true,
      read: true,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    // Simulate reply after 2 seconds
    setTimeout(() => {
      const replies = [
        "Thanks for letting me know!",
        "I'll check on that right away.",
        "That's great to hear!",
        "I've made a note of that.",
        "Take care and let me know if you need anything else.",
      ];

      const reply = {
        id: messages.length + 2,
        contactId: selectedContact.id,
        sender: selectedContact.name,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: "Just now",
        isSent: false,
        read: false,
      };

      setMessages((prev) => [...prev, reply]);

      // Provide haptic feedback
      if (navigator.vibrate) navigator.vibrate(100);

      // Announce new message in voice mode
      if (voiceMode) {
        speakText(`New message from ${selectedContact.name}`);
      }
    }, 2000);
  };

  const handleVoiceMessage = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert(
        "Voice input is not supported in your browser. Please type your message."
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
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
      console.error("Speech recognition error", event.error);
      alert("Voice input failed. Please try typing instead.");
    };
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);

    // Mark messages as read
    setMessages(
      messages.map((msg) =>
        msg.contactId === contact.id && !msg.isSent
          ? { ...msg, read: true }
          : msg
      )
    );

    // Announce in voice mode
    if (voiceMode) {
      speakText(`Now chatting with ${contact.name}, ${contact.role}`);
    }

    // Provide haptic feedback
    if (navigator.vibrate) navigator.vibrate(30);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleEmergencyCall = () => {
    if (selectedContact) {
      speakText(`Calling ${selectedContact.name}...`);
      alert(`Calling ${selectedContact.name}...\nPhone: (555) 123-4567`);
    } else {
      alert("Please select a contact to call.");
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
            aria-label={
              voiceMode ? "Turn off voice mode" : "Turn on voice mode"
            }
          >
            {voiceMode ? "🔊 On" : "🔊 Off"}
          </button>
        </div>
      </header>

      <div className="messages-layout">
        {/* Contacts Sidebar */}
        <div className="contacts-sidebar">
          <h2 className="sidebar-title">Contacts</h2>
          <div className="contacts-list">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                className={`contact-item ${
                  selectedContact?.id === contact.id ? "active" : ""
                }`}
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
                  <div
                    className="unread-badge"
                    aria-label={`${contact.unread} unread messages`}
                  >
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
              onClick={() => alert("Add contact feature")}
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
                    onClick={() => alert("Video call feature")}
                    aria-label={`Video call with ${selectedContact.name}`}
                  >
                    📹 Video
                  </button>
                </div>
              </div>

              {/* Messages Container */}
              <div className="messages-list" aria-live="polite">
                {messages
                  .filter((msg) => msg.contactId === selectedContact.id)
                  .map((message) => (
                    <div
                      key={message.id}
                      className={`message-bubble ${
                        message.isSent ? "sent" : "received"
                      } ${!message.read && !message.isSent ? "unread" : ""}`}
                      aria-label={`${
                        message.isSent ? "You said" : `${message.sender} said`
                      }: ${message.text} at ${message.time}`}
                    >
                      {!message.isSent && (
                        <div className="message-sender">{message.sender}</div>
                      )}
                      <div className="message-text">{message.text}</div>
                      <div className="message-time">{message.time}</div>
                      {message.isSent && (
                        <div className="message-status">
                          {message.read ? "✓✓" : "✓"}
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
                      onClick={() => alert("Emoji picker")}
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
                    <strong>Tip:</strong> Press and hold the microphone button
                    to speak your message.
                  </p>
                  <p className="tip">
                    <strong>Accessibility:</strong> All messages are read aloud
                    when voice mode is on.
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
