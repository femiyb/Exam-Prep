import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Added state to manage error messages
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const response = await fetch('http://127.0.0.1:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        // Assuming the response includes a redirect URL or token
        const data = await response.json();
        // Typically you'd handle or store the token here, e.g., in local storage
        // localStorage.setItem('userToken', data.token);
        navigate('/courses'); // Navigate to courses upon successful login
      } else {
        // Handle non-ok responses gracefully
        const data = await response.json();
        setError(data.message || 'Login failed, please try again.');
      }
    } catch (error) {
      // Network or other fetch errors
      setError('Server error or network issue');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Log In</button>
        {error && <p className="error">{error}</p>} {/* Display any error messages */}
      </form>
    </div>
  );
}

export default Login;
