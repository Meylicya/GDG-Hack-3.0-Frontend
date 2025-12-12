import React from 'react';
import { Link } from 'react-router-dom';
import './SettingsPage.css';

const SettingsPage = ({ 
  fontSize, setFontSize, 
  highContrast, setHighContrast, 
  voiceMode, setVoiceMode,
  language, setLanguage 
}) => {
  const fontSizes = [
    { id: 'small', label: 'Small' },
    { id: 'medium', label: 'Medium' },
    { id: 'large', label: 'Large' },
    { id: 'xlarge', label: 'Extra Large' },
  ];

  const languages = [
    { id: 'en', label: 'English' },
    { id: 'es', label: 'Español' },
    { id: 'fr', label: 'Français' },
    { id: 'de', label: 'Deutsch' },
    { id: 'zh', label: '中文' },
  ];

  const toggleSettings = [
    { id: 'medication-reminders', label: 'Medication Reminders', checked: true },
    { id: 'appointment-alerts', label: 'Appointment Alerts', checked: true },
    { id: 'daily-check-ins', label: 'Daily Check-ins', checked: true },
    { id: 'vibration-feedback', label: 'Vibration Feedback', checked: true },
  ];

  return (
    <div className="settings-container">
      <header className="settings-header">
        <Link to="/dashboard" className="back-button">
          ← Back to Dashboard
        </Link>
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Customize your AssistMe experience</p>
      </header>

      <div className="settings-grid">
        {/* Display Settings */}
        <div className="settings-card">
          <h2 className="settings-card-title">Display Settings</h2>
          
          <div className="setting-group">
            <label className="setting-label">Text Size</label>
            <div className="font-size-options">
              {fontSizes.map(size => (
                <button
                  key={size.id}
                  className={`font-size-option ${fontSize === size.id ? 'selected' : ''}`}
                  onClick={() => setFontSize(size.id)}
                  aria-label={`Set text size to ${size.label}`}
                >
                  A
                  <span className="option-label">{size.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="setting-group">
            <div className="toggle-setting">
              <div className="toggle-label">
                <span className="toggle-title">High Contrast Mode</span>
                <span className="toggle-description">Increase contrast for better visibility</span>
              </div>
              <button 
                className={`toggle-switch ${highContrast ? 'on' : 'off'}`}
                onClick={() => setHighContrast(!highContrast)}
                aria-label={`Turn high contrast mode ${highContrast ? 'off' : 'on'}`}
              >
                <div className="toggle-slider"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Voice & Language Settings */}
        <div className="settings-card">
          <h2 className="settings-card-title">Voice & Language</h2>
          
          <div className="setting-group">
            <div className="toggle-setting">
              <div className="toggle-label">
                <span className="toggle-title">Voice Assistant</span>
                <span className="toggle-description">Read out buttons and content</span>
              </div>
              <button 
                className={`toggle-switch ${voiceMode ? 'on' : 'off'}`}
                onClick={() => setVoiceMode(!voiceMode)}
                aria-label={`Turn voice assistant ${voiceMode ? 'off' : 'on'}`}
              >
                <div className="toggle-slider"></div>
              </button>
            </div>
          </div>

          <div className="setting-group">
            <label className="setting-label" htmlFor="language-select">Language</label>
            <select 
              id="language-select"
              className="language-select-large"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-card">
          <h2 className="settings-card-title">Notifications</h2>
          
          {toggleSettings.map(setting => (
            <div key={setting.id} className="setting-group">
              <div className="toggle-setting">
                <div className="toggle-label">
                  <span className="toggle-title">{setting.label}</span>
                  <span className="toggle-description">Receive alerts for this type</span>
                </div>
                <button 
                  className={`toggle-switch ${setting.checked ? 'on' : 'off'}`}
                  aria-label={`Turn ${setting.label} ${setting.checked ? 'off' : 'on'}`}
                >
                  <div className="toggle-slider"></div>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Caregiver Contact */}
        <div className="settings-card">
          <h2 className="settings-card-title">Caregiver Contact</h2>
          
          <div className="contact-list">
            <div className="contact-item">
              <span className="contact-name">Sarah B.</span>
              <span className="contact-relationship">Primary Caregiver</span>
              <a href="tel:+15551234567" className="contact-phone">+213 555 555</a>
            </div>
            
            <div className="contact-item">
              <span className="contact-name">Dr. Mohamed</span>
              <span className="contact-relationship">Primary Doctor</span>
              <a href="tel:+15559876543" className="contact-phone">+213 555 555</a>
            </div>
            
            <div className="contact-item">
              <span className="contact-name">Emergency</span>
              <span className="contact-relationship">24/7 Emergency</span>
              <a href="tel:911" className="contact-phone emergency">1548</a>
            </div>
          </div>

          <button className="add-contact-button">
            <span className="add-icon" role="img" aria-hidden="true">+</span>
            Add New Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;