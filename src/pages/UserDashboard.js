// pages/UserDashboard.js - Updated version
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../config/api";
import { fetchWithAuth } from "../App";
import "./UserDashboard.css";

const UserDashboard = ({ userData, onLogout }) => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Take morning medicine", completed: true },
    { id: 2, title: "Check blood pressure", completed: true },
    { id: 3, title: "Drink a glass of water", completed: false },
    { id: 4, title: "Walk for 5 minutes", completed: false },
    { id: 5, title: "5-minute breathing exercise", completed: false },
    { id: 6, title: "Take afternoon vitamins", completed: false },
  ]);

  const [mood, setMood] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const userId = userData?._id || localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch appointments
        if (userId) {
          try {
            const appointmentsRes = await fetchWithAuth(
              API_ENDPOINTS.APPOINTMENTS_BY_PATIENT(userId)
            );
            if (appointmentsRes && appointmentsRes.ok) {
              const appointmentsData = await appointmentsRes.json();
              const formattedAppointments = appointmentsData
                .slice(0, 3)
                .map((apt) => ({
                  id: apt._id,
                  time: apt.date
                    ? new Date(apt.date).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "TBD",
                  title: apt.notes || "Appointment",
                  icon: "👩‍⚕️",
                  date: apt.date,
                  caregiverName:
                    apt.caregiverId?.username || "Healthcare Provider",
                }));
              setAppointments(formattedAppointments);
            }
          } catch (err) {
            console.log("Could not fetch appointments:", err);
          }

          // Fetch messages
          try {
            const messagesRes = await fetchWithAuth(
              API_ENDPOINTS.MESSAGES_BY_USER(userId)
            );
            if (messagesRes && messagesRes.ok) {
              const messagesData = await messagesRes.json();
              const formattedMessages = messagesData.slice(0, 3).map((msg) => ({
                id: msg._id,
                senderName: msg.senderId?.username || "Caregiver",
                preview: msg.content || msg.message || msg.text,
                timestamp: msg.createdAt,
              }));
              setMessages(formattedMessages);
            }
          } catch (err) {
            console.log("Could not fetch messages:", err);
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setIsLoading(false);
      }
    };

    fetchData();

    // Update time every minute
    const timeTimer = setInterval(() => setCurrentTime(new Date()), 60000);

    return () => {
      clearInterval(timeTimer);
    };
  }, [userId]);

  const toggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );

    // Provide feedback
    if (navigator.vibrate) navigator.vibrate(30);
  };

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
    alert("Thanks! Your caregiver can now see your update.");
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  // Loading screen
  if (isLoading) {
    return (
      <div
        className="dashboard-loading"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          background: "var(--off-white)",
          zIndex: 1000,
        }}
      >
        <div className="loading-spinner"></div>
        <p
          style={{
            marginTop: "20px",
            fontSize: "1.2em",
            color: "var(--dark-gray)",
          }}
        >
          Loading your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
        <h1 className="greeting">Good Morning, {userData?.name || "Sam"} 👋</h1>
        <p className="date-subtext">{formatDate(currentTime)}</p>
      </header>

      {/* Progress Bar - Keep as it used to be */}
      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Daily Progress</span>
          <span className="progress-count">
            {completedTasks}/{totalTasks} completed
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Today's Tasks Card - Keep as it used to be */}
        <div className="dashboard-card">
          <div className="card-header">
            <span className="card-icon" role="img" aria-label="Tasks">
              ✅
            </span>
            <h2 className="card-title">Today's Tasks</h2>
          </div>
          <p className="card-subtitle">
            {completedTasks} of {totalTasks} completed
          </p>
          <div className="task-preview">
            {tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="task-item">
                <button
                  className={`task-checkbox ${
                    task.completed ? "completed" : ""
                  }`}
                  onClick={() => toggleTask(task.id)}
                  aria-label={`${
                    task.completed ? "Mark as incomplete" : "Mark as complete"
                  }: ${task.title}`}
                >
                  {task.completed ? "✓" : ""}
                </button>
                <span className="task-title">{task.title}</span>
              </div>
            ))}
          </div>
          <Link to="/tasks" className="card-button">
            View All Tasks
          </Link>
        </div>

        {/* Messages Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <span className="card-icon" role="img" aria-label="Messages">
              💬
            </span>
            <h2 className="card-title">Messages</h2>
            {messages.length > 0 && (
              <div className="badge">{messages.length}</div>
            )}
          </div>
          <p className="card-subtitle">{messages.length} new messages</p>
          <div className="messages-preview">
            {messages.slice(0, 2).map((message) => (
              <div key={message.id} className="message-item">
                <span className="message-sender">{message.senderName}</span>
                <span className="message-preview">{message.preview}...</span>
              </div>
            ))}
          </div>
          <button className="card-button" onClick={() => navigate("/messages")}>
            Open Messages
          </button>
        </div>

        {/* Schedule Card - Keep as it used to be */}
        <div className="dashboard-card">
          <div className="card-header">
            <span className="card-icon" role="img" aria-label="Schedule">
              📅
            </span>
            <h2 className="card-title">Schedule</h2>
          </div>
          <div className="appointments-list">
            {appointments.map((appt, index) => (
              <div key={index} className="appointment-item">
                <span className="appointment-icon">{appt.icon}</span>
                <span className="appointment-time">{appt.time}</span>
                <span className="appointment-title">{appt.title}</span>
              </div>
            ))}
          </div>
          <button className="card-button">View Calendar</button>
        </div>

        {/* Request Assistance Card - Remove Emergency Alert button */}
        <div className="dashboard-card emergency-card">
          <div className="card-header">
            <span className="card-icon" role="img" aria-label="Help">
              🆘
            </span>
            <h2 className="card-title">Request Assistance</h2>
          </div>
          <p className="card-subtitle">Help is always available</p>
          <div className="emergency-buttons">
            <Link to="/request-support" className="emergency-button">
              <span className="emergency-icon" role="img" aria-hidden="true">
                🆘
              </span>
              <span>I Need Help</span>
            </Link>
            {/* Remove the Service/Emergency Alert button */}
          </div>
        </div>

        {/* Health Check-in Card */}
        <div className="dashboard-card health-card">
          <div className="card-header">
            <span className="card-icon" role="img" aria-label="Health">
              ❤️
            </span>
            <h2 className="card-title">Health Check-in</h2>
          </div>
          <p className="card-question">How are you feeling today?</p>
          <div className="mood-selector">
            {["🙂", "😐", "🙁"].map((emoji, index) => (
              <button
                key={index}
                className={`mood-option ${mood === emoji ? "selected" : ""}`}
                onClick={() => handleMoodSelect(emoji)}
                aria-label={`Select ${
                  index === 0 ? "Good" : index === 1 ? "Neutral" : "Not good"
                } mood`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
