// components/AccessibilityToolbar.js
import React, { useState } from "react";
import "./AccessibilityToolbar.css";

const AccessibilityToolbar = ({
  fontSize,
  setFontSize,
  highContrast,
  setHighContrast,
  voiceMode,
  setVoiceMode,
  language,
  setLanguage,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    document.documentElement.setAttribute("data-font-size", size);
  };

  const handleVoiceToggle = () => {
    const newVoiceMode = !voiceMode;
    setVoiceMode(newVoiceMode);
    if (newVoiceMode) {
      // Read current page content
      const mainContent =
        document.querySelector("main")?.innerText || document.body.innerText;
      speakText(mainContent);
    }
  };

  const speakText = (text) => {
    if ("speechSynthesis" in window && voiceMode) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const startVoiceCommand = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert(
        "Voice commands not supported in this browser. Try Chrome or Edge."
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang =
      language === "es"
        ? "es-ES"
        : language === "fr"
        ? "fr-FR"
        : language === "de"
        ? "de-DE"
        : "en-US";

    recognitionInstance.onstart = () => {
      setIsListening(true);
      speakText("Listening for voice command...");
    };

    recognitionInstance.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      processVoiceCommand(command);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionInstance.onerror = (event) => {
      console.error("Voice recognition error:", event.error);
      setIsListening(false);
      speakText("Voice command failed. Please try again.");
    };

    setRecognition(recognitionInstance);
    recognitionInstance.start();
  };

  const processVoiceCommand = (command) => {
    console.log("Voice command received:", command);

    // Navigation commands
    if (command.includes("go to") || command.includes("open")) {
      if (command.includes("dashboard")) {
        window.location.href = "/dashboard";
        speakText("Going to dashboard");
      } else if (command.includes("messages") || command.includes("chat")) {
        window.location.href = "/messages";
        speakText("Opening messages");
      } else if (command.includes("tasks") || command.includes("todo")) {
        window.location.href = "/tasks";
        speakText("Opening tasks");
      } else if (command.includes("settings")) {
        window.location.href = "/settings";
        speakText("Opening settings");
      } else if (command.includes("request") || command.includes("help")) {
        window.location.href = "/request-support";
        speakText("Opening request support");
      }
    }

    // Action commands
    else if (
      command.includes("increase font") ||
      command.includes("bigger text")
    ) {
      handleFontSizeChange(
        fontSize === "small"
          ? "medium"
          : fontSize === "medium"
          ? "large"
          : "xlarge"
      );
      speakText("Font size increased");
    } else if (
      command.includes("decrease font") ||
      command.includes("smaller text")
    ) {
      handleFontSizeChange(
        fontSize === "xlarge"
          ? "large"
          : fontSize === "large"
          ? "medium"
          : "small"
      );
      speakText("Font size decreased");
    } else if (
      command.includes("contrast") ||
      command.includes("high contrast")
    ) {
      setHighContrast(!highContrast);
      speakText(
        highContrast ? "High contrast disabled" : "High contrast enabled"
      );
    } else if (command.includes("voice") || command.includes("read")) {
      setVoiceMode(!voiceMode);
      speakText(voiceMode ? "Voice mode disabled" : "Voice mode enabled");
    } else if (command.includes("logout") || command.includes("sign out")) {
      // This would need to be passed as a prop
      speakText("Logging out");
      setTimeout(() => {
        const logoutBtn = document.querySelector(".logout-button");
        if (logoutBtn) logoutBtn.click();
      }, 1000);
    }

    // Health-related commands
    else if (command.includes("mood") || command.includes("feeling")) {
      speakText(
        "Please use the mood selector buttons on the dashboard to log how you are feeling"
      );
    } else if (command.includes("medicine") || command.includes("medication")) {
      speakText(
        "Remember to take your medications as prescribed. Check your daily tasks for reminders"
      );
    } else if (command.includes("emergency") || command.includes("help me")) {
      speakText(
        "If this is an emergency, please call emergency services immediately at 9 1 1"
      );
    }

    // AI Assistant commands
    else if (
      command.includes("ai") ||
      command.includes("assistant") ||
      command.includes("help me with")
    ) {
      const aiButton = document.querySelector(".chatbot-toggle");
      if (aiButton) {
        aiButton.click();
        speakText("Opening AI assistant");
      } else {
        speakText("AI assistant not available on this page");
      }
    }

    // Default response
    else {
      speakText(
        `I heard: ${command}. Try saying "go to dashboard", "increase font", "open messages", or "help me with AI"`
      );
    }
  };

  return (
    <div
      className={`accessibility-toolbar ${highContrast ? "high-contrast" : ""}`}
    >
      <div className="toolbar-content">
        <button
          className="toolbar-button"
          onClick={() =>
            handleFontSizeChange(
              fontSize === "small"
                ? "medium"
                : fontSize === "medium"
                ? "large"
                : "xlarge"
            )
          }
          aria-label="Increase font size"
        >
          A+
        </button>

        <button
          className="toolbar-button"
          onClick={() =>
            handleFontSizeChange(
              fontSize === "xlarge"
                ? "large"
                : fontSize === "large"
                ? "medium"
                : "small"
            )
          }
          aria-label="Decrease font size"
        >
          A-
        </button>

        <button
          className={`toolbar-button ${highContrast ? "active" : ""}`}
          onClick={() => setHighContrast(!highContrast)}
          aria-label="Toggle high contrast mode"
        >
          <span role="img" aria-label="Contrast">
            ◐
          </span>
        </button>

        <button
          className={`toolbar-button ${voiceMode ? "active" : ""}`}
          onClick={handleVoiceToggle}
          aria-label="Toggle voice mode"
        >
          <span role="img" aria-label="Voice">
            🔊
          </span>
        </button>

        <button
          className={`toolbar-button voice-command ${
            isListening ? "listening" : ""
          }`}
          onClick={startVoiceCommand}
          disabled={isListening}
          aria-label="Voice commands"
        >
          <span role="img" aria-label="Voice Command">
            🎤
          </span>
          {isListening && <span className="listening-indicator"></span>}
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
