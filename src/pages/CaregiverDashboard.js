// pages/CaregiverDashboard.js - Reorganized and Improved
import React, { useState, useEffect } from 'react';
import './CaregiverDashboard.css';

const CaregiverDashboard = ({ userData, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, messages, patients
  const [newMessage, setNewMessage] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Current patient (Sam) - main patient being cared for
  const currentPatient = {
    id: 0,
    name: 'Sam Wilson',
    age: 72,
    status: 'current',
    mood: '🙂',
    lastActivity: '10 min ago',
    tasksCompleted: '2/6',
    location: 'Home',
    contact: '(555) 123-4567',
    needs: 'Daily medication management, mobility assistance, and companionship. Recovering from minor surgery.',
    budget: 'Already contracted',
    nextAppointment: 'Today, 2:00 PM - Physical Therapy',
    notes: 'Responds well to morning routine. Prefers tea with breakfast.',
    healthStatus: 'Stable',
    medications: ['Lisinopril 10mg', 'Metformin 500mg', 'Vitamin D 1000IU']
  };

  // Sample patient requests (others seeking care)
  const sampleRequests = [
    {
      id: 1,
      name: 'Robert Johnson',
      age: 78,
      location: '2 miles away',
      status: 'pending',
      needs: 'Daily medication management and light housekeeping.',
      budget: '$25/hour',
      duration: '3 hours daily',
      requestedServices: ['Medication', 'Housekeeping'],
      contact: '(555) 123-4567'
    },
    {
      id: 2,
      name: 'Margaret Williams',
      age: 82,
      location: '5 miles away',
      status: 'pending',
      needs: 'Physical therapy exercises and meal preparation.',
      budget: '$30/hour',
      duration: '4 hours, 3x/week',
      requestedServices: ['Physical Therapy', 'Meal Prep'],
      contact: '(555) 234-5678'
    },
    {
      id: 3,
      name: 'Thomas Davis',
      age: 70,
      location: '4 miles away',
      status: 'pending',
      needs: 'Post-stroke rehabilitation and speech therapy.',
      budget: '$28/hour',
      duration: '2 hours daily',
      requestedServices: ['Rehabilitation', 'Speech Therapy'],
      contact: '(555) 567-8901'
    }
  ];

  // Messages with Sam
  const [messages, setMessages] = useState([
    { id: 1, sender: 'You', text: 'Good morning Sam! Did you take your morning medication?', time: '9:30 AM' },
    { id: 2, sender: 'Sam Wilson', text: 'Yes, I took it at 8 AM with breakfast.', time: '9:35 AM' },
    { id: 3, sender: 'You', text: 'Great! How are you feeling today?', time: '9:40 AM' },
    { id: 4, sender: 'Sam Wilson', text: 'Feeling good. Ready for my walk later.', time: '9:42 AM' },
    { id: 5, sender: 'You', text: 'Remember we have physical therapy at 2 PM today.', time: '10:15 AM' },
  ]);

  // Appointment logs for Sam
  const appointmentLogs = [
    { id: 1, type: 'Doctor', date: 'Jan 12', time: '2:00 PM', notes: 'Regular checkup - Blood pressure normal', status: 'completed' },
    { id: 2, type: 'Nurse', date: 'Jan 11', time: '10:00 AM', notes: 'Medication review - All good', status: 'completed' },
    { id: 3, type: 'Therapist', date: 'Today', time: '2:00 PM', notes: 'Physical therapy session', status: 'upcoming' },
    { id: 4, type: 'Doctor', date: 'Jan 16', time: '11:00 AM', notes: 'Follow-up appointment', status: 'scheduled' },
    { id: 5, type: 'Lab', date: 'Jan 18', time: '9:00 AM', notes: 'Blood tests', status: 'scheduled' }
  ];

  // Upcoming tasks for Sam
  const upcomingTasks = [
    { id: 1, task: 'Morning medication', time: '8:00 AM', completed: true },
    { id: 2, task: 'Blood pressure check', time: '9:00 AM', completed: true },
    { id: 3, task: '15-minute walk', time: '11:00 AM', completed: false },
    { id: 4, task: 'Lunch medication', time: '12:30 PM', completed: false },
    { id: 5, task: 'Physical therapy', time: '2:00 PM', completed: false },
    { id: 6, task: 'Evening medication', time: '7:00 PM', completed: false }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setPatients(sampleRequests);
      setIsLoading(false);
    }, 500);
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'You',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simulate Sam's reply after 2 seconds
      setTimeout(() => {
        const replies = [
          "Thanks for checking in!",
          "I'll do that right now.",
          "Feeling good today.",
          "I've taken my medication.",
          "Ready for our session later."
        ];
        const reply = {
          id: messages.length + 2,
          sender: 'Sam Wilson',
          text: replies[Math.floor(Math.random() * replies.length)],
          time: 'Just now'
        };
        setMessages(prev => [...prev, reply]);
      }, 2000);
    }
  };

  const handleAcceptRequest = (patientId) => {
    setPatients(patients.map(patient => 
      patient.id === patientId ? { ...patient, status: 'accepted' } : patient
    ));
    alert(`You have accepted ${patients.find(p => p.id === patientId)?.name}'s request!`);
  };

  const handleDeclineRequest = (patientId) => {
    setPatients(patients.map(patient => 
      patient.id === patientId ? { ...patient, status: 'declined' } : patient
    ));
    alert(`You have declined ${patients.find(p => p.id === patientId)?.name}'s request.`);
  };

  const handleContactPatient = (patient) => {
    alert(`Calling ${patient.name} at ${patient.contact}`);
  };

  const pendingRequests = patients.filter(p => p.status === 'pending');

  if (isLoading) {
    return (
      <div className="caregiver-loading">
        <div className="loading-spinner"></div>
        <p>Loading caregiver dashboard...</p>
      </div>
    );
  }

  return (
    <div className="caregiver-container">
      {/* Header */}
      <header className="caregiver-header">
        <button onClick={onLogout} className="logout-button">
          🚪 Logout
        </button>
        <div className="header-content">
          <h1 className="caregiver-title">Caregiver Dashboard</h1>
          <div className="caregiver-info">
            <span className="caregiver-name">Welcome, {userData?.name || 'Sarah'}</span>
            <span className="caregiver-status">👩‍⚕️ Certified Caregiver</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            💬 Messages
          </button>
          <button 
            className={`tab-button ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            👥 Patient Requests
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <>
            {/* Current Patient Overview */}
            <div className="current-patient-section">
              <h2 className="section-title">
                <span className="title-icon">👤</span>
                Current Patient: {currentPatient.name}
              </h2>
              
              <div className="patient-overview-grid">
                {/* Patient Summary Card */}
                <div className="overview-card patient-summary">
                  <div className="card-header">
                    <h3>Patient Summary</h3>
                    <div className="status-badge current">Current Patient</div>
                  </div>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">Age</span>
                      <span className="summary-value">{currentPatient.age} years</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Mood</span>
                      <span className="summary-value mood">{currentPatient.mood}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Health Status</span>
                      <span className="summary-value status-good">{currentPatient.healthStatus}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Last Activity</span>
                      <span className="summary-value">{currentPatient.lastActivity}</span>
                    </div>
                  </div>
                  <div className="patient-notes">
                    <h4>Care Notes</h4>
                    <p>{currentPatient.notes}</p>
                  </div>
                </div>

                {/* Today's Tasks */}
                <div className="overview-card tasks-card">
                  <div className="card-header">
                    <h3>Today's Tasks</h3>
                    <span className="task-count">{currentPatient.tasksCompleted} completed</span>
                  </div>
                  <div className="tasks-list">
                    {upcomingTasks.map(task => (
                      <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                        <div className="task-checkbox">
                          {task.completed ? '✓' : ''}
                        </div>
                        <span className="task-text">{task.task}</span>
                        <span className="task-time">{task.time}</span>
                      </div>
                    ))}
                  </div>
                  <button className="view-all-button">View All Tasks</button>
                </div>

                {/* Medications */}
                <div className="overview-card medications-card">
                  <div className="card-header">
                    <h3>Current Medications</h3>
                  </div>
                  <div className="medications-list">
                    {currentPatient.medications.map((med, index) => (
                      <div key={index} className="medication-item">
                        <span className="medication-icon">💊</span>
                        <span className="medication-name">{med}</span>
                        <span className="medication-schedule">Daily</span>
                      </div>
                    ))}
                  </div>
                  <div className="next-dose">
                    <span className="dose-label">Next Dose:</span>
                    <span className="dose-time">12:30 PM</span>
                  </div>
                </div>

                {/* Next Appointment */}
                <div className="overview-card appointment-card">
                  <div className="card-header">
                    <h3>Next Appointment</h3>
                    <span className="appointment-status upcoming">Upcoming</span>
                  </div>
                  <div className="appointment-details">
                    <div className="appointment-icon">🏥</div>
                    <div className="appointment-info">
                      <div className="appointment-title">Physical Therapy</div>
                      <div className="appointment-time">Today at 2:00 PM</div>
                      <div className="appointment-location">Home Visit</div>
                    </div>
                  </div>
                  <button className="remind-button">Set Reminder</button>
                </div>
              </div>
            </div>

            {/* Appointment Logs Section */}
            <div className="appointments-section">
              <h2 className="section-title">
                <span className="title-icon">📋</span>
                Appointment History
              </h2>
              <div className="appointments-table">
                <div className="table-header">
                  <div className="table-cell type">Type</div>
                  <div className="table-cell date">Date</div>
                  <div className="table-cell time">Time</div>
                  <div className="table-cell notes">Notes</div>
                  <div className="table-cell status">Status</div>
                </div>
                {appointmentLogs.map(log => (
                  <div key={log.id} className="table-row">
                    <div className="table-cell type">
                      <span className="log-icon">{log.type === 'Doctor' ? '👨‍⚕️' : 
                                               log.type === 'Nurse' ? '👩‍⚕️' : 
                                               log.type === 'Therapist' ? '🧘' : 
                                               log.type === 'Lab' ? '🩸' : '📅'}</span>
                      {log.type}
                    </div>
                    <div className="table-cell date">{log.date}</div>
                    <div className="table-cell time">{log.time}</div>
                    <div className="table-cell notes">{log.notes}</div>
                    <div className="table-cell status">
                      <span className={`status-badge ${log.status}`}>
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Requests Preview */}
            <div className="requests-preview">
              <div className="preview-header">
                <h2 className="section-title">
                  <span className="title-icon">👥</span>
                  New Patient Requests
                </h2>
                <button 
                  className="view-all-button"
                  onClick={() => setActiveTab('patients')}
                >
                  View All ({pendingRequests.length})
                </button>
              </div>
              {pendingRequests.length > 0 ? (
                <div className="requests-grid">
                  {pendingRequests.slice(0, 2).map(patient => (
                    <div key={patient.id} className="request-card">
                      <div className="request-header">
                        <div className="patient-avatar">{patient.name.charAt(0)}</div>
                        <div className="patient-info">
                          <div className="patient-name">{patient.name}, {patient.age}</div>
                          <div className="patient-location">{patient.location}</div>
                        </div>
                        <div className="request-budget">{patient.budget}</div>
                      </div>
                      <p className="request-needs">{patient.needs}</p>
                      <div className="request-actions">
                        <button 
                          className="accept-btn"
                          onClick={() => handleAcceptRequest(patient.id)}
                        >
                          Accept
                        </button>
                        <button 
                          className="decline-btn"
                          onClick={() => handleDeclineRequest(patient.id)}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-requests">
                  <span className="no-data-icon">🎉</span>
                  <p>No new patient requests at this time.</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'messages' && (
          <div className="messages-section">
            <h2 className="section-title">
              <span className="title-icon">💬</span>
              Messages with Sam Wilson
            </h2>
            
            <div className="messages-container">
              <div className="messages-list">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`message ${message.sender === 'You' ? 'sent' : 'received'}`}
                  >
                    <div className="message-sender">{message.sender}</div>
                    <div className="message-content">
                      <div className="message-text">{message.text}</div>
                      <div className="message-time">{message.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="message-input-area">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message to Sam..."
                  className="message-input"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="send-button" onClick={sendMessage}>
                  Send
                </button>
                <button className="voice-button" title="Voice message">
                  🎤
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="patients-section">
            <h2 className="section-title">
              <span className="title-icon">👥</span>
              Patient Requests
            </h2>
            
            <div className="requests-container">
              {pendingRequests.length > 0 ? (
                <div className="requests-list">
                  {pendingRequests.map(patient => (
                    <div key={patient.id} className="detailed-request-card">
                      <div className="request-header">
                        <div className="patient-avatar-large">{patient.name.charAt(0)}</div>
                        <div className="patient-details">
                          <div className="patient-main-info">
                            <h3 className="patient-name">{patient.name}, {patient.age}</h3>
                            <div className="patient-location">{patient.location}</div>
                          </div>
                          <div className="patient-contact">
                            <span className="contact-label">Contact:</span>
                            <span className="contact-number">{patient.contact}</span>
                          </div>
                        </div>
                        <div className="request-budget-large">
                          <span className="budget-amount">{patient.budget}</span>
                          <span className="budget-duration">{patient.duration}</span>
                        </div>
                      </div>
                      
                      <div className="request-details">
                        <div className="detail-section">
                          <h4>Care Needs</h4>
                          <p>{patient.needs}</p>
                        </div>
                        
                        <div className="detail-section">
                          <h4>Requested Services</h4>
                          <div className="services-tags">
                            {patient.requestedServices.map((service, index) => (
                              <span key={index} className="service-tag">{service}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="request-actions-large">
                        <button 
                          className="accept-btn-large"
                          onClick={() => handleAcceptRequest(patient.id)}
                        >
                          <span className="action-icon">✓</span>
                          Accept Request
                        </button>
                        <button 
                          className="decline-btn-large"
                          onClick={() => handleDeclineRequest(patient.id)}
                        >
                          <span className="action-icon">✗</span>
                          Decline
                        </button>
                        <button 
                          className="contact-btn-large"
                          onClick={() => handleContactPatient(patient)}
                        >
                          <span className="action-icon">📞</span>
                          Contact
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-requests-full">
                  <div className="empty-state">
                    <span className="empty-icon">👥</span>
                    <h3>No Patient Requests</h3>
                    <p>You don't have any new patient requests at this time.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaregiverDashboard;