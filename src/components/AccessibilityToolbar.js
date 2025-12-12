// components/AccessibilityToolbar.js
import React from 'react';
import './AccessibilityToolbar.css';

const AccessibilityToolbar = ({ 
  fontSize, setFontSize, 
  highContrast, setHighContrast, 
  voiceMode, setVoiceMode,
  language, setLanguage 
}) => {
  const handleFontSizeChange = (size) => {
    setFontSize(size);
    document.documentElement.setAttribute('data-font-size', size);
  };

  const handleVoiceToggle = () => {
    const newVoiceMode = !voiceMode;
    setVoiceMode(newVoiceMode);
    if (newVoiceMode) {
      // Read current page content
      const mainContent = document.querySelector('main')?.innerText || 
                         document.body.innerText;
      speakText(mainContent);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window && voiceMode) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`accessibility-toolbar ${highContrast ? 'high-contrast' : ''}`}>
      <div className="toolbar-content">
        <button 
          className="toolbar-button"
          onClick={() => handleFontSizeChange(fontSize === 'small' ? 'medium' : fontSize === 'medium' ? 'large' : 'xlarge')}
          aria-label="Increase font size"
        >
          A+
        </button>
        
        <button 
          className="toolbar-button"
          onClick={() => handleFontSizeChange(fontSize === 'xlarge' ? 'large' : fontSize === 'large' ? 'medium' : 'small')}
          aria-label="Decrease font size"
        >
          A-
        </button>
        
        <button 
          className={`toolbar-button ${highContrast ? 'active' : ''}`}
          onClick={() => setHighContrast(!highContrast)}
          aria-label="Toggle high contrast mode"
        >
          <span role="img" aria-label="Contrast">◐</span>
        </button>
        
        <button 
          className={`toolbar-button ${voiceMode ? 'active' : ''}`}
          onClick={handleVoiceToggle}
          aria-label="Toggle voice mode"
        >
          <span role="img" aria-label="Voice">🔊</span>
        </button>
        
        <select 
          className="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          aria-label="Select language"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </div>
    </div>
  );
};

export default AccessibilityToolbar;