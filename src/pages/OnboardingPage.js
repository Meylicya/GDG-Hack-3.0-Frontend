// pages/OnboardingPage.js - Updated with offline demo support
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingPage.css';

const OnboardingPage = ({ onSelectUserType }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const navigate = useNavigate();

  // Password strength checker
  useEffect(() => {
    if (!isLogin && password) {
      let strength = 'weak';
      if (password.length >= 8) strength = 'medium';
      if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
        strength = 'strong';
      }
      setPasswordStrength(strength);
    }
  }, [password, isLogin]);

  // Form validation
  const validateField = (name, value) => {
    const errors = { ...formErrors };
    
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
        
      case 'password':
        if (value && value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        } else {
          delete errors.password;
        }
        break;
        
      case 'name':
        if (!value.trim()) {
          errors.name = 'Name is required';
        } else if (value.trim().length < 2) {
          errors.name = 'Name must be at least 2 characters';
        } else {
          delete errors.name;
        }
        break;
    }
    
    setFormErrors(errors);
  };

  const handleBlur = (field) => {
    setTouchedFields({ ...touchedFields, [field]: true });
    
    switch (field) {
      case 'email':
        validateField('email', email);
        break;
      case 'password':
        validateField('password', password);
        break;
      case 'name':
        validateField('name', name);
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = {};
    if (!selectedUserType) {
      errors.userType = 'Please select user type';
      setError('Please select whether you are a User or Caregiver');
    }
    if (isLogin) {
      if (!email) errors.email = 'Email is required';
      if (!password) errors.password = 'Password is required';
    } else {
      if (!name) errors.name = 'Name is required';
      if (!email) errors.email = 'Email is required';
      if (!password) errors.password = 'Password is required';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Set touched fields for all to show errors
      Object.keys(errors).forEach(field => {
        touchedFields[field] = true;
      });
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      // Check if backend is available
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      if (isLogin) {
        // Try real login
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
              userType: selectedUserType
            })
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token || 'demo-token');
            localStorage.setItem('user', JSON.stringify(data.user || { name, email, type: selectedUserType }));
            localStorage.setItem('userType', selectedUserType);
            localStorage.setItem('isDemo', 'false');
            
            onSelectUserType(selectedUserType);
            navigate(selectedUserType === 'user' ? '/dashboard' : '/caregiver');
            return;
          }
        } catch (apiError) {
          console.log('API not available, using demo mode');
        }
        
        // If API fails, use demo mode with entered credentials
        localStorage.setItem('token', 'demo-token');
        localStorage.setItem('user', JSON.stringify({ 
          name: email.split('@')[0], 
          email, 
          type: selectedUserType 
        }));
        localStorage.setItem('userType', selectedUserType);
        localStorage.setItem('isDemo', 'true');
        
        onSelectUserType(selectedUserType);
        navigate(selectedUserType === 'user' ? '/dashboard' : '/caregiver');
        
      } else {
        // Signup - Try real registration
        try {
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name,
              email,
              password,
              userType: selectedUserType
            })
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token || 'demo-token');
            localStorage.setItem('user', JSON.stringify(data.user || { name, email, type: selectedUserType }));
            localStorage.setItem('userType', selectedUserType);
            localStorage.setItem('isDemo', 'false');
            
            onSelectUserType(selectedUserType);
            navigate(selectedUserType === 'user' ? '/dashboard' : '/caregiver');
            return;
          }
        } catch (apiError) {
          console.log('API not available, using demo mode for signup');
        }
        
        // If API fails, use demo mode
        localStorage.setItem('token', 'demo-token');
        localStorage.setItem('user', JSON.stringify({ 
          name, 
          email, 
          type: selectedUserType 
        }));
        localStorage.setItem('userType', selectedUserType);
        localStorage.setItem('isDemo', 'true');
        
        onSelectUserType(selectedUserType);
        navigate(selectedUserType === 'user' ? '/dashboard' : '/caregiver');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Using demo mode instead.');
      // Even on error, allow demo access
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('user', JSON.stringify({ 
        name: name || 'Demo User', 
        email: email || 'demo@example.com', 
        type: selectedUserType 
      }));
      localStorage.setItem('userType', selectedUserType);
      localStorage.setItem('isDemo', 'true');
      
      setTimeout(() => {
        onSelectUserType(selectedUserType);
        navigate(selectedUserType === 'user' ? '/dashboard' : '/caregiver');
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        alert(`Password reset link sent to ${email}`);
        setShowForgotPassword(false);
      } else {
        // If backend fails, show helpful message
        alert(`In demo mode: A reset link would be sent to ${email}`);
        setShowForgotPassword(false);
      }
    } catch (err) {
      // In demo mode, simulate success
      alert(`In demo mode: A reset link would be sent to ${email}`);
      setShowForgotPassword(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAccess = (type) => {
    setIsLoading(true);
    setError('');
    
    // Create demo user data
    const demoUsers = {
      user: {
        name: 'Sam Wilson',
        email: 'sam@example.com',
        type: 'user',
        age: 72,
        caregiver: 'Sarah Johnson'
      },
      caregiver: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        type: 'caregiver',
        patient: 'Sam Wilson'
      }
    };
    
    const demoData = demoUsers[type];
    
    // Store demo data
    localStorage.setItem('token', 'demo-token-' + Date.now());
    localStorage.setItem('user', JSON.stringify(demoData));
    localStorage.setItem('userType', type);
    localStorage.setItem('isDemo', 'true');
    
    // Show success message
    setError(`Demo mode activated! Logging in as ${demoData.name}...`);
    
    // Navigate after short delay
    setTimeout(() => {
      onSelectUserType(type);
      navigate(type === 'user' ? '/dashboard' : '/caregiver');
    }, 1000);
  };

  return (
    <div className="onboarding-container">
      <header className="onboarding-header">
        <div className="logo" role="img" aria-label="AssistMe Logo">
          ❤️
        </div>
        <h1 className="main-title">Welcome to AssistMe</h1>
        <p className="subtitle">Your Daily Support Companion for Seniors</p>
      </header>

      <div className="introduction-section">
        <h2 className="section-title">How AssistMe Helps You</h2>
        <div className="services-grid">
          <div className="service-card">
            <span className="service-icon" role="img" aria-hidden="true">📋</span>
            <h3>Daily Task Management</h3>
            <p>Medication reminders, exercise routines, and daily activities</p>
          </div>
          <div className="service-card">
            <span className="service-icon" role="img" aria-hidden="true">💬</span>
            <h3>Family Communication</h3>
            <p>Stay connected with caregivers and family members</p>
          </div>
          <div className="service-card">
            <span className="service-icon" role="img" aria-hidden="true">🏥</span>
            <h3>Health Tracking</h3>
            <p>Monitor health metrics and appointment schedules</p>
          </div>
          <div className="service-card">
            <span className="service-icon" role="img" aria-hidden="true">🆘</span>
            <h3>Emergency Support</h3>
            <p>Quick access to help when you need it most</p>
          </div>
        </div>
      </div>

      <div className="auth-container">
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true);
              setShowForgotPassword(false);
              setError('');
            }}
            disabled={isLoading}
          >
            Login
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setShowForgotPassword(false);
              setError('');
            }}
            disabled={isLoading}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-content">
          {error && (
            <div className={`error-message ${error.includes('Demo mode') ? 'demo-message' : ''}`}>
              <span role="img" aria-hidden="true">
                {error.includes('Demo mode') ? '🎮' : '⚠️'}
              </span> 
              {error}
            </div>
          )}

          {showForgotPassword ? (
            <div className="forgot-password-section">
              <h3>Reset Your Password</h3>
              <p>Enter your email address and we'll send you a reset link</p>
              <div className="auth-input-group">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  disabled={isLoading}
                />
              </div>
              <div className="button-group">
                <button 
                  className="secondary-button"
                  onClick={() => setShowForgotPassword(false)}
                  disabled={isLoading}
                >
                  Back to Login
                </button>
                <button 
                  className="primary-button"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="user-type-selection">
                <h3 className="selection-title">I am a:</h3>
                <div className="type-options">
                  <button 
                    className={`type-option ${selectedUserType === 'user' ? 'selected' : ''}`}
                    onClick={() => setSelectedUserType('user')}
                    disabled={isLoading}
                  >
                    <span className="option-icon" role="img" aria-hidden="true">👤</span>
                    <span className="option-text">User / Patient</span>
                    <span className="option-description">I need daily assistance</span>
                  </button>
                  
                  <button 
                    className={`type-option ${selectedUserType === 'caregiver' ? 'selected' : ''}`}
                    onClick={() => setSelectedUserType('caregiver')}
                    disabled={isLoading}
                  >
                    <span className="option-icon" role="img" aria-hidden="true">👨‍👩‍👧‍👦</span>
                    <span className="option-text">Caregiver / Family</span>
                    <span className="option-description">I provide care and support</span>
                  </button>
                </div>
                {touchedFields.userType && formErrors.userType && (
                  <div className="validation-message error" style={{ textAlign: 'center', marginTop: '8px' }}>
                    {formErrors.userType}
                  </div>
                )}
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="auth-input-group">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (touchedFields.name) validateField('name', e.target.value);
                      }}
                      onBlur={() => handleBlur('name')}
                      className={`auth-input ${touchedFields.name ? (formErrors.name ? 'invalid' : name ? 'valid' : '') : ''}`}
                      required={!isLogin}
                      disabled={isLoading}
                    />
                    {touchedFields.name && formErrors.name && (
                      <div className="validation-message error">{formErrors.name}</div>
                    )}
                  </div>
                )}
                
                <div className="auth-input-group">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (touchedFields.email) validateField('email', e.target.value);
                    }}
                    onBlur={() => handleBlur('email')}
                    className={`auth-input ${touchedFields.email ? (formErrors.email ? 'invalid' : email ? 'valid' : '') : ''}`}
                    required
                    disabled={isLoading}
                  />
                  {touchedFields.email && formErrors.email && (
                    <div className="validation-message error">{formErrors.email}</div>
                  )}
                </div>
                
                <div className="auth-input-group">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (touchedFields.password) validateField('password', e.target.value);
                    }}
                    onBlur={() => handleBlur('password')}
                    className={`auth-input ${touchedFields.password ? (formErrors.password ? 'invalid' : password ? 'valid' : '') : ''}`}
                    required
                    disabled={isLoading}
                  />
                  {touchedFields.password && formErrors.password && (
                    <div className="validation-message error">{formErrors.password}</div>
                  )}
                  
                  {!isLogin && password && (
                    <div className="password-strength">
                      <div className="strength-text">
                        Password strength: 
                        <span className={`strength-indicator ${passwordStrength}`}>
                          {passwordStrength === 'weak' ? ' Weak' : 
                           passwordStrength === 'medium' ? ' Medium' : 
                           passwordStrength === 'strong' ? ' Strong' : ''}
                        </span>
                      </div>
                      <div className="strength-bar">
                        <div className={`strength-fill ${passwordStrength}`}></div>
                      </div>
                    </div>
                  )}
                </div>

                {isLogin && (
                  <button 
                    type="button"
                    className="forgot-password-link"
                    onClick={() => setShowForgotPassword(true)}
                    disabled={isLoading}
                  >
                    Forgot Password?
                  </button>
                )}

                <button 
                  type="submit" 
                  className={`submit-button ${isLoading ? 'loading' : ''}`}
                  disabled={!selectedUserType || isLoading}
                >
                  {isLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
                </button>
              </form>

              <div className="demo-access">
                <p className="demo-text">Want to explore first?</p>
                <div className="demo-buttons">
                  <button 
                    className="demo-button user-demo"
                    onClick={() => handleDemoAccess('user')}
                    disabled={isLoading}
                  >
                    <span role="img" aria-hidden="true">🎮</span>
                    {isLoading ? 'Loading...' : 'Try as User'}
                  </button>
                  <button 
                    className="demo-button caregiver-demo"
                    onClick={() => handleDemoAccess('caregiver')}
                    disabled={isLoading}
                  >
                    <span role="img" aria-hidden="true">🎮</span>
                    {isLoading ? 'Loading...' : 'Try as Caregiver'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Designed for Accessibility</h2>
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon" role="img" aria-label="Large text">🔍</span>
            <span>Adjustable text size</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon" role="img" aria-label="High contrast">🌈</span>
            <span>High contrast mode</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon" role="img" aria-label="Voice control">🎤</span>
            <span>Voice assistance</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon" role="img" aria-label="Simple interface">👍</span>
            <span>Simple, clear interface</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;