// components/AIHealthInsights.js
import React, { useState, useEffect } from "react";
import API_ENDPOINTS from "../config/api";
import { fetchWithAuth } from "../App";
import "./AIHealthInsights.css";

const AIHealthInsights = ({ userData }) => {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setIsLoading(true);
        const response = await fetchWithAuth(
          API_ENDPOINTS.USERS_AI_INSIGHTS(userData._id)
        );

        if (response && response.ok) {
          const data = await response.json();
          setInsights(data.insights);
        } else {
          setError("Unable to load AI insights at this time");
        }
      } catch (err) {
        console.error("Error fetching AI insights:", err);
        setError("Unable to load AI insights at this time");
      } finally {
        setIsLoading(false);
      }
    };

    if (userData?._id) {
      fetchInsights();
    }
  }, [userData]);

  if (isLoading) {
    return (
      <div className="ai-insights-loading">
        <div className="ai-loading-spinner"></div>
        <p>Analyzing your health data...</p>
      </div>
    );
  }

  if (error || !insights) {
    return (
      <div className="ai-insights-error">
        <p>🤖 AI insights temporarily unavailable</p>
        <small>We'll show personalized recommendations when available</small>
      </div>
    );
  }

  return (
    <div className="ai-health-insights">
      <div className="insights-header">
        <div className="ai-icon">🧠</div>
        <div className="insights-title">
          <h3>AI Health Insights</h3>
          <div className="health-score">
            <span className="score-label">Health Score:</span>
            <span
              className={`score-value ${
                insights.healthScore >= 85
                  ? "excellent"
                  : insights.healthScore >= 75
                  ? "good"
                  : "needs-attention"
              }`}
            >
              {insights.healthScore}/100
            </span>
          </div>
        </div>
      </div>

      <div className="insights-content">
        {/* Recommendations */}
        <div className="insight-section">
          <h4>💡 Personalized Recommendations</h4>
          <ul className="recommendations-list">
            {insights.recommendations.map((rec, index) => (
              <li key={index} className="recommendation-item">
                <span className="rec-icon">✓</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* Positive Habits */}
        <div className="insight-section">
          <h4>🌟 Your Strengths</h4>
          <ul className="positive-habits-list">
            {insights.positiveHabits.map((habit, index) => (
              <li key={index} className="habit-item">
                <span className="habit-icon">⭐</span>
                {habit}
              </li>
            ))}
          </ul>
        </div>

        {/* Risk Factors */}
        <div className="insight-section">
          <h4>⚠️ Areas to Monitor</h4>
          <ul className="risk-factors-list">
            {insights.riskFactors.map((risk, index) => (
              <li key={index} className="risk-item">
                <span className="risk-icon">⚠️</span>
                {risk}
              </li>
            ))}
          </ul>
        </div>

        {/* Next Steps */}
        <div className="insight-section">
          <h4>🚀 Next Steps</h4>
          <ul className="next-steps-list">
            {insights.nextSteps.map((step, index) => (
              <li key={index} className="step-item">
                <span className="step-number">{index + 1}</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="insights-footer">
        <small>
          🤖 Powered by AI • Always consult healthcare professionals for medical
          advice
        </small>
      </div>
    </div>
  );
};

export default AIHealthInsights;
