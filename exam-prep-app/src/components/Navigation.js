import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navigation.css';
import LogoutButton from './LogoutButton'; // Adjust the path based on your file structure



function Navigation() {
  const isAuthenticated = localStorage.getItem('userToken');

  return (
    <nav className="nav-container">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/courses" className="nav-link">Courses</Link>
        </li>
        <li className="nav-item">
          <Link to="/about" className="nav-link">About</Link>
        </li>
       
        {isAuthenticated && (
          <>
          <li className="nav-item log-out">
                    <LogoutButton /> {/* Logout button added here */}
        </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
