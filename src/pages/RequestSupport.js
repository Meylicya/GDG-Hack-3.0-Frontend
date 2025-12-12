// pages/RequestSupport.js
import React, { useState } from 'react';
import './RequestSupport.css';

const RequestSupport = () => {
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [step, setStep] = useState(1);

  const categories = [
    { id: 'health', name: 'Health', icon: '🏥', description: 'Medical assistance, nurse visits, medication help' },
    { id: 'transport', name: 'Transport', icon: '🚗', description: 'Transportation services, ride to appointments' },
    { id: 'groceries', name: 'Groceries', icon: '🛒', description: 'Grocery delivery, shopping assistance' },
    { id: 'home-care', name: 'Home Care', icon: '🧹', description: 'Cleaning, maintenance, home help' },
  ];

  const handleEmergency = () => {
    alert('Calling caregiver...\nEmergency contact: Sarah - (555) 123-4567');
    // In a real app, this would initiate a call
  };

  const handleNonEmergency = () => {
    setShowCategories(true);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setStep(2);
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      alert(`Request submitted successfully!\n\n${selectedCategory.name} assistance will be arranged within 2 hours.`);
      setShowCategories(false);
      setSelectedCategory(null);
      setStep(1);
    }
  };

  return (
    <div className="request-support-container">
      <header className="request-header">
        <h1 className="request-title">Request Support</h1>
        <p className="request-subtitle">Help is always available when you need it</p>
      </header>

      {!showCategories ? (
        <div className="emergency-buttons-container">
          <button 
            className="emergency-button-large"
            onClick={handleEmergency}
            aria-label="Emergency Help - Call caregiver immediately"
          >
            <span className="button-icon-large" role="img" aria-hidden="true">🔴</span>
            <span className="button-text-large">Emergency Help</span>
            <span className="button-subtext">Call caregiver immediately</span>
          </button>
          
          <button 
            className="non-emergency-button-large"
            onClick={handleNonEmergency}
            aria-label="Non-emergency request"
          >
            <span className="button-icon-large" role="img" aria-hidden="true">🟦</span>
            <span className="button-text-large">Non-emergency Request</span>
            <span className="button-subtext">Request assistance for daily needs</span>
          </button>
        </div>
      ) : (
        <div className="category-container">
          {step === 1 && (
            <>
              <h2 className="category-title">What do you need help with?</h2>
              <div className="category-grid">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className="category-card"
                    onClick={() => handleCategorySelect(category)}
                    aria-label={`Request ${category.name} assistance`}
                  >
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-name">{category.name}</span>
                    <span className="category-description">{category.description}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && selectedCategory && (
            <div className="wizard-step">
              <h2 className="wizard-title">Tell us more</h2>
              <div className="wizard-content">
                <div className="selected-category">
                  <span className="selected-icon">{selectedCategory.icon}</span>
                  <span className="selected-name">{selectedCategory.name} Assistance</span>
                </div>
                
                <div className="form-group">
                  <label htmlFor="details" className="form-label">
                    Please describe what you need:
                  </label>
                  <textarea
                    id="details"
                    className="form-textarea"
                    rows="4"
                    placeholder="For example: Need grocery delivery for milk, eggs, and bread..."
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="urgency" className="form-label">
                    How soon do you need help?
                  </label>
                  <select id="urgency" className="form-select">
                    <option value="">Select urgency level</option>
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="this-week">This week</option>
                  </select>
                </div>
              </div>
              
              <div className="wizard-buttons">
                <button 
                  className="wizard-button back"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button 
                  className="wizard-button next"
                  onClick={handleNextStep}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && selectedCategory && (
            <div className="wizard-step">
              <h2 className="wizard-title">Confirm your request</h2>
              <div className="confirmation-content">
                <div className="confirmation-card">
                  <div className="confirmation-header">
                    <span className="confirmation-icon">{selectedCategory.icon}</span>
                    <span className="confirmation-category">{selectedCategory.name}</span>
                  </div>
                  
                  <div className="confirmation-details">
                    <div className="detail-item">
                      <span className="detail-label">Service:</span>
                      <span className="detail-value">{selectedCategory.name} Assistance</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value pending">Pending approval</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Estimated time:</span>
                      <span className="detail-value">Within 2 hours</span>
                    </div>
                  </div>
                  
                  <div className="confirmation-notice">
                    Your caregiver will review this request and contact you shortly.
                  </div>
                </div>
              </div>
              
              <div className="wizard-buttons">
                <button 
                  className="wizard-button back"
                  onClick={() => setStep(2)}
                >
                  Back
                </button>
                <button 
                  className="wizard-button submit"
                  onClick={handleNextStep}
                >
                  Submit Request
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestSupport;