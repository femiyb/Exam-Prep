import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear the user token and other profile data from storage
        localStorage.removeItem('userToken');
        // Navigate to login or home page
        navigate('/');
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}

export default LogoutButton;
