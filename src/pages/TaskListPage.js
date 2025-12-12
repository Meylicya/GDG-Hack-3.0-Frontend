import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TaskListPage.css';

const TaskListPage = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Take morning medicine", completed: true },
    { id: 2, title: "Check blood pressure", completed: true },
    { id: 3, title: "Drink a glass of water", completed: false },
    { id: 4, title: "Walk for 5 minutes", completed: false },
    { id: 5, title: "5-minute breathing exercise", completed: false },
    { id: 6, title: "Take afternoon vitamins", completed: false },
  ]);

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const completed = !task.completed;
        if (completed) {
          if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
          // Play success sound
          if (typeof window !== 'undefined') {
            const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3');
            audio.volume = 0.3;
            audio.play();
          }
        }
        return { ...task, completed };
      }
      return task;
    }));
  };

  const playVoiceInstructions = (taskTitle) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`Instructions for ${taskTitle}`);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="task-list-container">
      <header className="task-list-header">
        <Link to="/dashboard" className="back-button">
          ← Back to Dashboard
        </Link>
        <h1 className="page-title">Today's Tasks</h1>
        <p className="page-subtitle">
          {tasks.filter(t => t.completed).length} of {tasks.length} completed
        </p>
      </header>

      <div className="task-list">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`task-item ${task.completed ? 'completed' : ''}`}
          >
            <button 
              className="task-checkbox"
              onClick={() => toggleTask(task.id)}
              aria-label={task.completed ? `Mark ${task.title} as incomplete` : `Complete ${task.title}`}
            >
              {task.completed && (
                <svg className="checkmark" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              )}
            </button>
            
            <div className="task-content">
              <h3 className="task-title">{task.title}</h3>
              <button 
                className="voice-instruction-button"
                onClick={() => playVoiceInstructions(task.title)}
                aria-label={`Play voice instructions for ${task.title}`}
              >
                <span role="img" aria-hidden="true">🔊</span>
                Play Instructions
              </button>
            </div>
            
            {task.completed && (
              <div className="completion-confetti">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="confetti" style={{
                    '--delay': `${i * 0.2}s`,
                    '--rotation': `${i * 72}deg`
                  }}>🎉</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskListPage;