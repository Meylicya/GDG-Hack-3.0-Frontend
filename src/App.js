// App.js - Updated with authentication check
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import OnboardingPage from "./pages/OnboardingPage";
import UserDashboard from "./pages/UserDashboard";
import TaskListPage from "./pages/TaskListPage";
import CaregiverDashboard from "./pages/CaregiverDashboard";
import RequestSupport from "./pages/RequestSupport";
import SettingsPage from "./pages/SettingsPage";
import AccessibilityToolbar from "./components/AccessibilityToolbar";
import AIChatbot from "./components/AIChatbot";
import MessagesPage from "./pages/MessagesPage";
import "./App.css";

// API utility functions
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    window.location.href = "/";
    return null;
  }

  return response;
};

export { API_BASE_URL };

function App() {
  const [userType, setUserType] = useState(null);
  const [userData, setUserData] = useState(null);
  const [fontSize, setFontSize] = useState("medium");
  const [highContrast, setHighContrast] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const savedUserType = localStorage.getItem("userType");
      const savedUser = localStorage.getItem("user");

      if (token && savedUserType && savedUser) {
        try {
          // Verify token with backend
          const response = await fetchWithAuth("/auth/verify");

          if (response && response.ok) {
            setUserType(savedUserType);
            setUserData(JSON.parse(savedUser));
          } else {
            // Clear invalid auth data
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("userType");
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.clear();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  const handleLogout = async () => {
    try {
      await fetchWithAuth("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
      setUserType(null);
      setUserData(null);
      window.location.href = "/";
    }
  };

  const accessibilitySettings = {
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    voiceMode,
    setVoiceMode,
    language,
    setLanguage,
    handleLogout,
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading AssistMe...</p>
      </div>
    );
  }

  return (
    <div
      className={`App ${
        highContrast ? "high-contrast" : ""
      } font-size-${fontSize}`}
    >
      <Router>
        <AccessibilityToolbar {...accessibilitySettings} />
        <Routes>
          <Route
            path="/"
            element={
              userType ? (
                <Navigate
                  to={userType === "user" ? "/dashboard" : "/caregiver"}
                />
              ) : (
                <OnboardingPage onSelectUserType={handleUserTypeSelect} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              userType === "user" ? (
                <UserDashboard
                  userData={userData}
                  onLogout={handleLogout}
                  fetchWithAuth={fetchWithAuth}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/tasks"
            element={
              userType === "user" ? (
                <TaskListPage
                  userData={userData}
                  fetchWithAuth={fetchWithAuth}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/caregiver"
            element={
              userType === "caregiver" ? (
                <CaregiverDashboard
                  userData={userData}
                  onLogout={handleLogout}
                  fetchWithAuth={fetchWithAuth}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/request-support"
            element={
              userType === "user" ? (
                <RequestSupport
                  userData={userData}
                  fetchWithAuth={fetchWithAuth}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/settings"
            element={
              <SettingsPage
                {...accessibilitySettings}
                userData={userData}
                fetchWithAuth={fetchWithAuth}
              />
            }
          />
          <Route
            path="/messages"
            element={
              userType === "user" ? (
                <MessagesPage userData={userData} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </Router>

      {/* AI Chatbot - Only show for authenticated users */}
      {userType && userData && (
        <AIChatbot userData={userData} fetchWithAuth={fetchWithAuth} />
      )}
    </div>
  );
}

export default App;
