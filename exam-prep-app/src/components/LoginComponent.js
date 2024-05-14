import React, { useState } from 'react';
import { useAuth } from '../AuthContext'; // Adjust the path as necessary

function LoginComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleLogin = async () => {
        // Implement your login logic here
        const token = 'your_generated_token_after_login'; // Simulate token reception
        login(token);
    };

    return (
        <div>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default LoginComponent;
