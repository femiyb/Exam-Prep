import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear the user token and other profile data from storage
        localStorage.removeItem('userToken');
        // Optionally, clear all local storage data
        // localStorage.clear();
        
        // Navigate to login or home page
        navigate('/login'); // Change to your login route if it's different
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}

export default LogoutButton;
