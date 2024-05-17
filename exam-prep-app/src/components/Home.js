import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const isAuthenticated = localStorage.getItem('userToken');

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <h1>{getWelcomeMessage()}, welcome to QuizApp!</h1>
        <p>Enhance your learning through fun and engaging quizzes across various topics.</p>
        {isAuthenticated && (
          <Link to="/courses" className="button">Start Learning</Link>
        )}
        {!isAuthenticated && (
        <div className="auth-buttons">
          <Link to="/login" className="button">Login</Link>
          <Link to="/register" className="button">Register</Link>
        </div>
        )}
        <p className="motivational-quote">
          "Knowledge is power. Information is liberating. Education is the premise of progress, in every society, in every family." – Kofi Annan
        </p>
        <div className="statistics">
          <p>Join thousands of users who improve their knowledge daily!</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
