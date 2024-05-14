import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';


function Home() {
  return (
    <div className="home-container">
      <h1>Welcome</h1>
      <div className="auth-buttons">
        <Link to="/login" className="button">Login</Link>
        <Link to="/register" className="button">Register</Link>
    </div>
    </div>
  );
}

export default Home;
