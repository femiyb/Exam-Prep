import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import '../styles/Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if the email has the desired domain
  const validateEmailDomain = (email) => {
    return email.endsWith('@my.richfield.ac.za');
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Ensure the email matches the allowed domain
    if (!validateEmailDomain(email)) {
      setError('Only emails ending with @my.richfield.ac.za are allowed.');
      return;
    }

    // Ensure the password is at least 8 characters long
    if (password.length < 8) {
      setError('Password should be at least 8 characters long.');
      return;
    }

    // Ensure the confirmPassword matches the original password
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Clear errors
    setError('');

    // Make the registration API request
    try {
        const response = await fetch('http://127.0.0.1:5001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        navigate('/login');
      } else {
        setError('Registration failed, please try again.');
      }
    } catch (error) {
      setError('Server error, please try again later.');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Student Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Register</button>
        <Link to="/login" className="button">Login</Link>

      </form>
    </div>
  );
}

export default Register;
