// components/AIChatbot.js
import React, { useState, useRef, useEffect } from "react";
import "./AIChatbot.css";

const AIChatbot = ({ userData, fetchWithAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello ${
        userData?.name || "there"
      }! I'm your AI assistant. I can help you with:\n\n• Finding caregivers\n• Scheduling appointments\n• Medication reminders\n• General health questions\n• Platform navigation\n\nHow can I assist you today?`,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    // Simple rule-based responses (can be enhanced with actual AI API)
    if (lowerMessage.includes("caregiver") || lowerMessage.includes("help")) {
      return "I can help you find a caregiver! Would you like me to guide you to the 'Request Support' page where you can submit a service request? Caregivers in your area will be notified and can accept your request.";
    }

    if (
      lowerMessage.includes("appointment") ||
      lowerMessage.includes("schedule")
    ) {
      return "For appointments, you can check your upcoming appointments in the dashboard. If you need to schedule a new one, please contact your assigned caregiver directly through the messages section.";
    }

    if (
      lowerMessage.includes("medicine") ||
      lowerMessage.includes("medication")
    ) {
      return "Medication reminders are important! You can view your medication schedule in your daily tasks. If you need to update your medications, please inform your caregiver. Would you like me to remind you about any specific medication?";
    }

    if (
      lowerMessage.includes("emergency") ||
      (lowerMessage.includes("help") && lowerMessage.includes("now"))
    ) {
      return "🚨 If this is an emergency, please call emergency services immediately at 911 (US) or your local emergency number. For non-emergency caregiver assistance, I can help you send a message to your assigned caregiver.";
    }

    if (lowerMessage.includes("mood") || lowerMessage.includes("feeling")) {
      return "Tracking your mood is great for your well-being! You can log your mood in the dashboard. How are you feeling right now? I'm here to listen and can suggest some calming activities if you'd like.";
    }

    if (lowerMessage.includes("task") || lowerMessage.includes("todo")) {
      return "You can view and complete your daily tasks in the 'Tasks' section of your dashboard. Staying on top of your daily routine is important for your health! Is there a specific task you'd like help with?";
    }

    // Default helpful response
    return "I'm here to help! I can assist you with finding caregivers, scheduling, medication reminders, or general questions about using the platform. What specific help do you need today?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(inputMessage);
      const botMessage = {
        id: messages.length + 2,
        text: aiResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    {
      text: "Find a caregiver",
      action: () => setInputMessage("I need help finding a caregiver"),
    },
    {
      text: "Medication reminder",
      action: () => setInputMessage("Remind me about my medications"),
    },
    {
      text: "Schedule appointment",
      action: () => setInputMessage("I need to schedule an appointment"),
    },
    {
      text: "How am I doing?",
      action: () => setInputMessage("Check my health progress"),
    },
  ];

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        className={`chatbot-toggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="AI Assistant"
      >
        {isOpen ? "✕" : "🤖"}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-avatar">🤖</div>
            <div className="chatbot-info">
              <h3>AI Health Assistant</h3>
              <span className="chatbot-status">● Online</span>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.sender === "user" ? "user" : "bot"
                }`}
              >
                <div className="message-content">
                  {message.text.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="message bot typing">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="quick-actions">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="quick-action-btn"
                  onClick={() => {
                    action.action();
                    setTimeout(handleSendMessage, 100);
                  }}
                >
                  {action.text}
                </button>
              ))}
            </div>
          )}

          <div className="chatbot-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="send-btn"
            >
              📤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
